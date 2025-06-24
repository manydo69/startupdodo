import { AfterViewInit, Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Book } from '@labsforge/flipbook';
import { DEVICE_TYPE } from 'app/shared/constant';
import { API } from 'environments/environment.prod';
import { forEach } from 'lodash';
import { PageFlip } from 'page-flip';
@Component({
    selector: 'app-flipbookview',
    templateUrl: './flipbookview.component.html',
    styleUrls: ['./flipbookview.component.scss']
})
export class FlipbookviewComponent implements OnInit, AfterViewInit {
    textArray: any[]

    // Device
    widthOff: number
    heightOff: number
    deviceType: any
    ApiImage: string = API.IMG;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<FlipbookviewComponent>
    ) {
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.onChangeWidthSize()
    }

    onChangeWidthSize() {
        this.widthOff = window.innerWidth;
        this.heightOff = window.innerHeight;
        if (this.widthOff < 768) {
            this.deviceType = DEVICE_TYPE.MOBILE;
        } else if (this.widthOff < 1024) {
            this.deviceType = DEVICE_TYPE.TABLET
        } else {
            this.deviceType = DEVICE_TYPE.PC;
        }
    }

    ngOnInit(): void {
        console.log(this.data);

        this.widthOff = window.innerWidth;
        this.heightOff = window.innerHeight;
        if (this.widthOff < 768) {
            this.deviceType = DEVICE_TYPE.MOBILE;
            if (this.data.content) {
                this.textArray = this.splitTextToParagraph(this.data.content, 2)
            }
        } else if (this.widthOff < 1024) {
            this.deviceType = DEVICE_TYPE.TABLET
            if (this.data.content) {
                this.textArray = this.splitTextToParagraph(this.data.content, 4)
            }
        } else {
            this.deviceType = DEVICE_TYPE.PC;
            if (this.data.content) {
                this.textArray = this.splitTextToParagraph(this.data.content, 6)
            }
        }

    }

    ngAfterViewInit(): void {
        var width, height;
        if (this.deviceType == DEVICE_TYPE.PC) {
            height = this.heightOff *0.9
            width = height*2/3
        } else if (this.deviceType == DEVICE_TYPE.TABLET) {
            height = this.heightOff *0.9
            width = height*2/3
        } else {
            width = this.widthOff * 0.8
            // height = width*2
            height = this.heightOff
        }
        const pageFlip = new PageFlip(document.getElementById('demoBookExample'),
            {
                width: width, // required parameter - base page width
                height: height,  // required parameter - base page height
                maxShadowOpacity: 0.5, // Half shadow intensity
                showCover: true,
                // mobileScrollSupport: false, // disable content scrolling on mobile devices
                usePortrait: true
            }
        );
        if (this.data.type == "TRUYEN_TRANH") {
            pageFlip.loadFromImages(this.data.files)
        } else {
            pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        }
    }

    splitTextToParagraph(text, numberOfSentencePerPara) {
        let textArray = text.split('</p>');
        textArray = textArray.map(element => element + '</p>');

        let numberOfPara = textArray.length / numberOfSentencePerPara;
        let paragraph = []
        for (let i = 0; i < numberOfPara; i++) {
            let para = ''
            let firstPosition = i * numberOfSentencePerPara
            let lastPosition = ((i + 1) * numberOfSentencePerPara - 1)
            let maxj = lastPosition > (textArray.length - 1) ? (textArray.length - 1) : lastPosition
            for (let j = firstPosition; j <= maxj; j++) {
                para += textArray[j];
            }
            paragraph.push(para)
        }
        return paragraph;
    }

    saveAndClose(): void {
        // Close the dialog
        this.matDialogRef.close();
    }
}
