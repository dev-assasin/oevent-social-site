import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../../../../services/app-service";
import {AuthService} from "../../../../auth/services/auth-service";
import {CreateAdvancedService} from "../services/advanced.service";

@Component({
    templateUrl: './email.component.html',
    styles: [
        `
           .fa-gear, .fa-info-circle{
            font-size:24px;
            position:relative;
            top:2px;
           }
           
           .fa-info-circle{
                color:#999;
                cursor:help;
           }
           
           .col-sm-10{
            margin-top:-4px;
           }
           
        `
    ],

})

export class AdvancedEmailComponent{

    eventSet:boolean = false;

    constructor(private auth: AuthService, private appService: AppService, private router: Router, private route: ActivatedRoute, public advancedService:CreateAdvancedService) {
        if(this.advancedService.eventSet){
            this.eventSet = true;
        }
        else{
            this.advancedService.waitForSet.first().subscribe(()=>{
                this.eventSet = true;
            });
        }
    }

    updateSettings(){
        this.appService.startLoadingBar();

        //GIVE THE UI-SWITCH A SPLIT SECOND TO UPDATE EVERYTHING
        setTimeout(()=>{
            //I USED A FULL SET HERE SINCE THIS VIEW IS TOUCHING EVERY PART OF THE SETTINGS OBJECT... IT KEEPS THE CODE SIMPLER, EVEN IF THERE ARE PERFORMANCE ISSUES
            this.advancedService.eventSettings$.set(this.advancedService.eventSettings).then(()=>{
                this.appService.stopLoadingBar();
            })
        }, 100);

    }


}
