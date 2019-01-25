var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateOpenFormHTML(list , style , totalTuition){
return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>student management</title>
    <style>
      ${style}
    </style>
  </head>
  <body>
  <div class="header">
    <div class="logo">
      <div class="logo-text"><a href="/">학생관리공간</a></div>
    </div>
    <div class="money">
      <div class="money-text">예상수입 : ${totalTuition}만원<a href="/"><a href="/" style="color : red;">&#8634;</a></div>
    </div>
  </div>
  <div class="transparent"></div>
  <div class="main">
    <div class="nav">
      <form action="/add_new_student" method="post">
      <button class="open-button">학생 추가하기</button>
      </form>
      ${list}
    </div>
    <div class="main-body">
      <div class="subject">학생 세부사항</div>
    </div>
  </div>
  <div class="transparent"></div>

  <div class="footer">
    <div class="footer-text">함승주 &nbsp; &nbsp; &nbsp; hsj1514@kaist.ac.kr</div>
  </div>

  </body>
</html>`;
}

function templateCloseFormHTML(list , style , totalTuition){
return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>student management</title>
    <style>
      ${style}
    </style>
  </head>
  <body>
  <div class="header">
    <div class="logo">
      <div class="logo-text"><a href="/">학생관리공간</a></div>
    </div>
    <div class="money">
      <div class="money-text">예상수입 : ${totalTuition}만원<a href="/"><a href="/" style="color : red;">&#8634;</a></div>
    </div>
  </div>
  <div class="transparent"></div>
  <div class="main">
    <div class="nav">
      ${list}
    </div>
    <div class="main-body">
      <div class="subject">학생 세부사항</div>
    </div>
  </div>
  <div class="transparent"></div>

  <form action="/create_process" method="post" class="addStudentForm" id="form">
  <p>
    &nbsp;학생이름&nbsp;<input type="text" name="name" placeholder="ex) 함승주" required>
  </p>
  <p>
    &nbsp;남학생<input type="radio" name="gender" value="male" checked required>
    &nbsp;여학생<input type="radio" name="gender" value="female" required>
  </p>
  <p>
    &nbsp;과목명&nbsp;<input type="text" name="subject" placeholder="ex) 물리" required></input>
  </p>
  <p>
    &nbsp;수업료(단위 : 만)&nbsp;<input class="inputTuition" type="number" name="tuition" placeholder="숫자만 입력" required></input>
  </p>
  <p>
    &nbsp;기타세부사항&nbsp;
    <p>&nbsp;&nbsp;&nbsp;
    <textarea class="textarea" name="others"></textarea></p>
  </p>
  <p class="complete-button-area">
    <input class="complete-button" type="submit" value="완료">
  </p>
  <p class="cancel-button-area">
  <a href="/" class="closeForm">창닫기</a>
  </p>
  </form>

  <div class="footer">
    <div class="footer-text">함승주 &nbsp; &nbsp; &nbsp; hsj1514@kaist.ac.kr</div>
  </div>

  </body>
</html>`;
}

function successTemplateHtml(){
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>student management</title>
    </head>
    <body>
      <p>학생추가 완료.</p>
      <form action="/" method="post">
      <button class="return-button">홈으로 돌아가기</button>
      </form>
    </body>
  </html>
  `
}

function templateIdHTML(list , style , totalTuition , description){
return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>student management</title>
    <style>
      ${style}
    </style>
  </head>
  <body>
  <div class="header">
    <div class="logo">
      <div class="logo-text"><a href="/">학생관리공간</a></div>
    </div>
    <div class="money">
      <div class="money-text">예상수입 : ${totalTuition}만원<a href="/"><a href="/" style="color : red;">&#8634;</a></div>
    </div>
  </div>
  <div class="transparent"></div>
  <div class="main">
    <div class="nav">
      <form action="/add_new_student" method="post">
      <button class="open-button">학생 추가하기</button>
      </form>
      ${list}
    </div>
    <div class="main-body">
      <div class="subject">학생 세부사항</div>
      ${description}
    </div>
  </div>
  <div class="transparent"></div>
  <div class="footer">
    <div class="footer-text">함승주 &nbsp; &nbsp; &nbsp; hsj1514@kaist.ac.kr</div>
  </div>

  </body>
</html>`;
}

function studentList(student){

  var list  = '<ul>';
  var i = 0;
  while(i < student.length){
    list = list + `<li><a href="/?id=${student[i]}">${student[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}

function tuitionCalculator(){
  i = 0;
  sum = 0;
  list = [];
  fs.readdir('./student' , 'utf8' , function(error , students){
    while(i < students.length){
      var nthstudentname = students[i]
      fs.readFile(`./student/${nthstudentname}/tuition` , 'utf8' , function(error , tuition){
        tuition = Number(tuition);
        sum = sum + tuition;
        list.push(sum);
        if(list[students.length-1] !== undefined){
          fs.writeFile('./totalTuition/totalTuition', Number(list[students.length-1]) , 'utf8' , function(err){
          })
        }
      })
      i = i + 1;
    }
  })
};

function makeStudentFolder(name , subject , tuition , others , gender){

  fs.mkdirSync(`./student/${name}`)
  fs.writeFile(`./student/${name}/subject`, subject , 'utf8' , function(err){
  })
  fs.writeFile(`./student/${name}/gender`, gender , 'utf8' , function(err){
  })
  fs.writeFile(`./student/${name}/tuition`, tuition , 'utf8' , function(err){
  })
  fs.writeFile(`./student/${name}/others`, others , 'utf8' , function(err){
  })
  fs.writeFile(`student/${name}/name` , name , 'utf8' , function(err){
  })
  fs.writeFile(`./student/${name}/arrangement`, '' , 'utf8' , function(err){
  })
};

function makeArrangementFile(){
  fs.readdir(`student` , function(error , student){
    i = 0;
    while(i < student.length){
      var nthstudentname = student[i]
      var tuition = fs.readFileSync(`./student/${nthstudentname}/tuition` , 'utf8');
      var subject = fs.readFileSync(`./student/${nthstudentname}/subject` , 'utf8');
      var name = fs.readFileSync(`./student/${nthstudentname}/name` , 'utf8');
      var gender = fs.readFileSync(`./student/${nthstudentname}/gender` , 'utf8');
      var others = fs.readFileSync(`./student/${nthstudentname}/others` , 'utf8');
      fs.writeFile(`student/${nthstudentname}/arrangement` , `<br><p><div class="studentsubject">학생이름</div> : ${name}(${gender})</p><br><p><div class="studentsubject">과목</div> : ${subject}</p><br><p><div class="studentsubject">과외비용</div> : ${tuition}만원</p><br><p><div class="studentsubject">기타내용</div> : ${others}</p>` , 'utf8' , function(err){
      });
      i = i + 1;
    }
  });
}


var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  fs.readdir(`student` , function(error , student){
    fs.readFile(`student/${queryData.id}/arrangement` , 'utf8' , function(err , description){

      makeArrangementFile();

      console.log("Request for " + pathname + " received.");
      console.log("id= " + queryData.id);

      if(queryData.id === `${queryData.id}`){
            fs.readFile('./css/style.css' , 'utf8' , function(error , style){
              tuitionCalculator();
              fs.readFile('./totalTuition/totalTuition' , 'utf8' , function(error , totalTuition){
                var list = studentList(student);
                var template = templateIdHTML(list , style , totalTuition , description)
                response.writeHead(200);
                response.end(template);
              });
            })
      } else if(pathname === '/') {
        fs.readdir('student' , function(error , student){

          fs.readFile('./css/style.css' , 'utf8' , function(error , style){
            tuitionCalculator();
            fs.readFile('./totalTuition/totalTuition' , 'utf8' , function(error , totalTuition){
              var list = studentList(student);
              var totalTuition = totalTuition;
              var template = templateOpenFormHTML(list , style , totalTuition);
              response.writeHead(200);
              response.end(template);
            })
          })
        });
      } else if(pathname === '/add_new_student') {
        fs.readdir('student' , function(error , student){
          fs.readFile('./css/style2.css' , 'utf8' , function(error , style){
            tuitionCalculator();
            fs.readFile('./totalTuition/totalTuition' , 'utf8' , function(error , totalTuition){
              var list = studentList(student);
              var template = templateCloseFormHTML(list , style , totalTuition);
              response.writeHead(200);
              response.end(template);
            })
          })
        });
      } else if(pathname === '/create_process'){
          var body = '';
          request.on('data' , function(data){
            body = body + data;
          });
          request.on('end' , function(){
            var post = qs.parse(body);
            var name = post.name;
            var subject = post.subject;
            var gender = post.gender;
            var tuition = post.tuition;
            var others = post.others;
            makeStudentFolder(name , subject , tuition , others , gender)
            response.writeHead(200);
            tuitionCalculator();
            var template = successTemplateHtml()
            response.end(template);
          });
      }
      else {
        response.writeHead(404);
        response.end('Not found');
      }
    })
  })
});
app.listen(3000);

console.log('Server running at http://127.0.0.1:3000/');
