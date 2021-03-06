import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../../services/app-service';
import { AuthService } from '../../../../auth/services/auth-service';
import { CreateAdvancedService } from '../services/advanced.service';
import { ToastyService } from 'ng2-toasty';
import { EventCompletionEmailSettings, PromoterWelcomeEmailSettings } from '../models/advanced-settings';

// ADD QUILL FOR TYPING
declare var Quill: any;

@Component({
    templateUrl: './promoter.component.html',
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

export class AdvancedPromoterComponent {

    quill: any;
    PromoterWelcome: PromoterWelcomeEmailSettings = new PromoterWelcomeEmailSettings();
    localSet = false;

    constructor(private auth: AuthService,
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private advancedService: CreateAdvancedService,
        private toasty: ToastyService) {

        // GIVE TIME TO ASSURE QUILL CONTAINER IS FULLY INITIALIZED
        if (this.advancedService.eventSet) {
            setTimeout(() => {
                this.initComponent();
            }, 300);
        } else {
            this.advancedService.waitForSet.first().subscribe(() => {
                console.log(this.advancedService.eventSettings);
                setTimeout(() => {
                    this.initComponent();
                }, 300);
            });
        }

    }

    initComponent() {
        this.PromoterWelcome = this.advancedService.eventSettings.PromoterWelcome;
        this.localSet = true;
        this.setQuill();
    }

    setQuill() {
        const toolbarOptions = [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            ['link']
        ];

        // INSTANTIATE BASED ON ID
        this.quill = new Quill('#editor', {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
        });

        // ALLOW ATTACHMENT OF EDITOR FIRST
        setTimeout(() => { this.initContent(); }, 500);

    }

    initContent() {

        this.quill.setContents(this.PromoterWelcome.body);

    }

    save() {

        this.appService.startLoadingBar();

        const body = this.quill.getContents();
        const html = this.quill.root.innerHTML;
        this.PromoterWelcome.body = body;
        this.PromoterWelcome.html = html;

        this.advancedService.eventSettings$.update({

            PromoterWelcome: this.PromoterWelcome

        }).then(() => {
            this.toasty.success('Promoter Welcome Email Updated!');
            this.appService.stopLoadingBar();
        });


    }


}
