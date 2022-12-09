import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { changeText } from 'src/app/util/changeText';
import { start, stop, getLatAndLon } from 'src/app/util/getLocationaAndAudio';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  step: number = 0;

  isEmailError: boolean = false;
  isPwdError: boolean = false;
  isSubmitError: boolean = false;
  submitErrorMessage: string = '';
  pwdErrorMessage: string = '';
  token: any = null;

  imageSrcs = [
    'img/1.jpeg', 'img/2.jpeg', 'img/3.jpeg',
    'img/4.jpeg', 'img/5.jpeg', 'img/6.jpeg',
    'img/7.jpeg', 'img/8.jpeg', 'img/9.jpeg'];

  form1: any = {
    email: '',
    password: '',
  }

  form2: any = {
    eotp: null,
    potp: null,
    gotp: null
  }

  form3: any = {
    checkedImages: [],
    blob: null,
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  check_email(email: string) {
    console.log(email);
    if (email.trim() == '') return;
    this.authService.check_email_login(changeText(email)).subscribe(
      data => {
        console.log(data);
        this.isEmailError = false;
      },
      err => {
        console.log(err);
        this.isEmailError = true;
      }
    );
  }

  onClickNext() {
    if (this.step == 0) {
      if (this.form1.email != '' && this.form1.password != '') {
        var formdata1 = {
          username: changeText(this.form1.email),
          password: changeText(this.form1.password)
        }
        this.authService.loginUser(formdata1).subscribe(
          data => {
            console.log(data);
            this.step++;
            this.authService.setToken(data.access_token);
          },
          err => {
            console.log(err);
          }
        )
      } else {
        this.isPwdError = true;
        this.pwdErrorMessage = "Please enter the mandatory field";
      }
    } else {
      var formdata2 = {
        eotp: this.form2.eotp,
        potp: this.form2.potp,
        gotp: this.form2.gotp,
        userid: changeText(this.form1.email)
      }
      this.authService.loginOtp(formdata2).subscribe(
        data => {
          console.log(data);
          this.step++;
          this.authService.getRandomImages(changeText(this.form1.email)).subscribe(
            data => {
              console.log(data);
              this.imageSrcs = data.slice(0, 9);
            },
            err => {
              console.log(err);
            }
          )
        },
        err => {
          console.log(err);
        }
      )
    }
  }

  onClickSubmit() {
    if (this.form3.checkedImages.length == 0) {
      this.isSubmitError = true;
      this.submitErrorMessage = "Please select image";
      return;
    }
    if (this.form3.blob == null) {
      this.isSubmitError = true;
      this.submitErrorMessage = "Please give voice input";
      return;
    }
    var formdata3 = new FormData();
    let data = new File([this.form3.blob], "audio.wav", { type: "wav", lastModified: new Date().getTime() });
    let container = new DataTransfer();
    container.items.add(data);
    let fileInputElement: any = document.getElementById("audiofile");
    fileInputElement.files = container.files;
    console.log(fileInputElement.files);
    var [lat, lon] = getLatAndLon();
    lat = 51.5072;
    lon = 0.1276;
    formdata3.append("audio", fileInputElement.files[0]);
    formdata3.append("file", this.form3.checkedImages);
    formdata3.append("userid", changeText(this.form1.email));
    formdata3.append("latitude", lat);
    formdata3.append("longitude", lon);
    this.authService.verifyImage(formdata3).subscribe(
      data => {
        console.log(data);
        alert('login success');
        this.isSubmitError = false;
      },
      err => {
        console.log(err);
        this.isSubmitError = true;
        this.submitErrorMessage = err.response;
      }
    )
  }

  startRecording() {
    console.log('start');
    start()
  }

  stopRecording() {
    console.log('stop');
    this.form3.blob = stop();
  }

  onSelectImage(event: any) {
    const id = event.target.id;
    if (event.target.checked) {
      if (this.form3.checkedImages.indexOf(id) === -1) {
        this.form3.checkedImages.push(id);
        this.form3.checkedImages.sort();
      }
    } else {
      const removeIdx = this.form3.checkedImages.indexOf(id);
      if (removeIdx !== -1) {
        this.form3.checkedImages.splice(removeIdx, 1);
      }
    }
  }

  split() {

    var imgfile = new Array();
    this.form3.checkedImages.map((checkImage: string) => {
      const id = parseInt(checkImage.slice(-1));
      imgfile.push(changeText(this.imageSrcs[id - 1]));
    })
    console.log(imgfile);
    var formdata = new FormData();
    // formdata.append("file", imgfile);
    // formdata.append("userid", changetext($("#email").val()));

    // var request = $.ajax({
    //   url: "http://localhost:8000/imgsplit",
    //   headers: { "Authorization": "Bearer " + token },
    //   type: "POST",
    //   async: false,
    //   data: formdata,
    //   processData: false,
    //   contentType: false
    // });

    // request.done(function (data) {
    //   var i = 0;
    //   $(".image-checkbox li").each(function (index) {
    //     $(this).find('img').attr('src', data[index]);
    //   });
    // });

    // request.fail(function (jqXHR, textStatus) {
    //   console.log(jqXHR);
    // });
  }

  onClickPrev() {
    this.step--;
  }

}
