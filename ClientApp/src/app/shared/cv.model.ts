export class CVModel {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  live_in_us: boolean;
  git_profile: string;
  about_you: string;
  cv: File;
  cover_letter: File;

  constructor() {
    this.first_name = "";
    this.last_name = "";
    this.email = "";
    this.phone_number = "";
    this.live_in_us = false;
    this.git_profile = "";
    this.about_you = "";
  }

}
