import { HttpHeaders } from "@angular/common/http";
// import { EncryptionDecryption } from "./encryptionFile";

export class AuthorizationToken {
  token: any;
  userInfo: any;
  data: any;
  constructor() {
  }


  gettoken() {
    this.data = localStorage.getItem("token");
    let dataToken = JSON.parse(this.data);
    let token = dataToken?.data?.token;
    let headerOption = {
      Authorization: token,
    };
    const headers = new HttpHeaders(headerOption);
    const options = { headers: headers };
    return options;
  }



  getLocalStorageID() {
    let data = localStorage.getItem("token");
    let dataToken = JSON.parse((data) || '{}');
    let id = dataToken.data._id;
    return id;
  }

  getLocalStorageByName() {
    let data = localStorage.getItem("token");
    let dataToken = JSON.parse((data) || '{}');
    let name = dataToken.data.name;
    return name;
  }
  getLocalStorageByImage() {
    let data = localStorage.getItem("token");
    let dataToken = JSON.parse((data) || '{}');
    let image = dataToken.data.image;
    return image;
  }
  getLocalStorageToken() {
    let data = localStorage.getItem("token");
    let dataToken = JSON.parse(data || '{}');
    let token = dataToken.data.token;

    return token;
  }

  getLocalStorageRole() {
    let data = localStorage.getItem("token");
    let dataToken = JSON.parse(data || '{}');
    let role = dataToken.data.role;

    return role;
  }

  getLocalStorageReferalCode() {
    let data = localStorage.getItem("token");
    let dataToken = JSON.parse(data || '{}');
    let myreferalcode = dataToken.data.myreferalcode;

    return myreferalcode;
  }

  //   getLocalStoragePaymentMode() {
  //     let data = localStorage.getItem("token");
  //     let dataToken = JSON.parse(data);
  //     let payment_status = dataToken.payment_status;
  //     return payment_status;
  //   }

  //   getLocalStorageName() {
  //     let data = localStorage.getItem("token");
  //     let dataToken = this.decryptObjectData(JSON.parse(data));
  //     let name = dataToken.name;

  //     return name;
  //   }

    getLocalStorageEmail() {
      let data = localStorage.getItem("token");
      let dataToken = JSON.parse((data) || '{}');
      let email = dataToken.data.email;
      return email;
    }

  getAge(date: any) {
    const convertAge = new Date(date);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    let showAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
    return showAge;
  }

  //   updateLocalStoragePahymentStatus(paymentStatus) {
  //     try {
  //       let data = localStorage.getItem("token");
  //       let dataToken = this.decryptObjectData(JSON.parse(data));
  //       dataToken.payment_status = paymentStatus;
  //       return true;
  //     } catch (error) {
  //       return false;
  //     }
  //   }

  //   getPasswordRegex(event) {
  //     const reg = new RegExp(
  //       /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}/g
  //     );
  //     if (reg.test(event)) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   frequecyInInteger = (frequency) => {
  //     let frequencyText = "";
  //     if (frequency === 1) {
  //       return (frequencyText = "Daily");
  //     } else if (frequency === 4) {
  //       return (frequencyText = "Bi-Weekly");
  //     } else if (frequency === 7) {
  //       return (frequencyText = "Weekly");
  //     } else if (frequency === 15) {
  //       return (frequencyText = "Bi-Monthly");
  //     } else if (frequency === 30) {
  //       return (frequencyText = "Monthly");
  //     } else {
  //       return (frequencyText = "");
  //     }
  //   };
}
