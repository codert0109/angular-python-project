import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { changeText } from 'src/app/util/changeText';
import { getLatAndLon, start, stop } from 'src/app/util/getLocationaAndAudio';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  step: number = 0;

  form1: any = {
    username: '',
    email: '',
    password: '',
    mobile: null,
    age: null,
    gender: null
  };

  form2: any = {
    eotp: null,
    motp: null,
  }

  form3: any = {

  }

  form4: any = {
    checkedImages: [],
    blob: null,
  }

  isEmailValidated = true;
  isCpwdValidated = true;
  isStep1Error = false;
  step1ErrorMessage = '';
  isSubmitError = false;
  submitErrorMessage = '';
  questions: any[] = [];


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // this.authService.getQuestions().subscribe(
    //   data => {
    //     console.log(data);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }

  check_email(email: string) {
    if (email.trim() == '') return;
    this.authService.check_email_signup(changeText(email)).subscribe(
      data => {
        this.isEmailValidated = true;
      },
      err => {
        console.log(err);
        this.isEmailValidated = false;
      }
    );
  }

  check_match_password(cpwd: string) {
    if (this.form1.password !== cpwd) {
      this.isCpwdValidated = false;
    } else {
      this.isCpwdValidated = true;
    }
  }

  onClickNext() {
    if (this.step === 0) {
      if (this.form1.email != '' && this.form1.cpwd != '' && this.form1.phone != '') {
        this.isStep1Error = false;
        var [lat, lon] = getLatAndLon();
        var formdata1 = {
          username: this.form1.username,
          email: changeText(this.form1.email),
          password: changeText(this.form1.password),
          mobile: this.form1.mobile,
          age: this.form1.age,
          gender: this.form1.gender,
          // latitude: lat,
          // longitude: lon
          latitude: 51.5072,
          longitude: 0.1276
        }
        this.authService.createUser(formdata1).subscribe(
          (data: any) => {
            this.step++;
          },
          (err: any) => {
            // console.log(err.error.detail[0].loc[1] + err.error.detail[0].msg);
            if (err.error && err.error.detail[0] != undefined) {
              this.isStep1Error = true;
              this.step1ErrorMessage = err.error.detail[0].loc[1].toUpperCase() + ' ' +  err.error.detail[0].msg;
            }
          }
        )
        this.authService.getQuestions().subscribe(
        data => {
          this.questions =  Object.assign([], data);  
        },
        err => {
          console.log(err);
        }
      );
      } else {
        this.isStep1Error = true;
        this.step1ErrorMessage = "Please enter the required fields";
      }

    } else if (this.step == 1) {
      // var formdata2 = {
      //   eotp: this.form2.eotp,
      //   motp: this.form2.motp,
      //   userid: changeText(this.form1.email)
      // }
      // this.authService.registerOtp(formdata2).subscribe(
      //   data => {
      //     console.log(data);
      //     this.step++;
      //     this.authService.getQuestions().subscribe(
      //       data => {
      //         console.log(data);
      //       },
      //       err => {
      //         console.log(err);
      //       }
      //     );
      //   },
      //   err => {
      //     console.log(err);
      //   }
      // )
      this.step++;

    } else {
      this.step++;
    }
  }

  onClickPrev() {
    this.step--;
  }

  onClickSubmit() {
    if (this.form4.checkedImages.length == 0) {
      this.isSubmitError = true;
      this.submitErrorMessage = "Please select image";
      return;
    }
    if (this.form4.blob == null) {
      this.isSubmitError = true;
      this.submitErrorMessage = "Please give voice input";
      return;
    }
    var formdata3 = new FormData();
    let data = new File([this.form4.blob], "audio.wav", { type: "wav", lastModified: new Date().getTime() });
    let container = new DataTransfer();
    container.items.add(data);
    let fileInputElement: any = document.getElementById("audiofile");
    fileInputElement.files = container.files;
    console.log(fileInputElement.files);
    formdata3.append("audio", fileInputElement.files[0]);
    formdata3.append("file", this.form4.checkedImages);
    formdata3.append("userid", changeText(this.form1.email));
    this.authService.signupSubmit(formdata3).subscribe(
      data => {
        console.log(data);
        alert('signup success1');
      },
      err => {
        console.log(err);
      }
    )
  }

  startRecording() {
    start()
  }

  stopRecording() {
    this.form4.blob = stop();
  }

  onSelectImage(event: any) {
    const id = event.target.id;
    if (event.target.checked) {
      if (this.form4.checkedImages.indexOf(id) === -1) {
        this.form4.checkedImages.push(id);
        this.form4.checkedImages.sort();
      }
    } else {
      const removeIdx = this.form4.checkedImages.indexOf(id);
      if (removeIdx !== -1) {
        this.form4.checkedImages.splice(removeIdx, 1);
      }
    }
  }

  onSelectGender(event: any) {
    this.form1.gender = event.target.value;
  }

}
