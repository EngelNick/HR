import {
  Component,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';

@Component({
  selector: 'text-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

export class EditorComponent implements OnInit {
  @Input() elementId: String;
  @Input() value: String;
  @Output() onEditorKeyup = new EventEmitter<any>();

  editor;
  didSetValue: boolean = false;

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      statubar: true,
      plugins: [
        "advlist autolink link image lists charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
        "save table contextmenu directionality emoticons template paste textcolor"
      ],
      toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor",
      style_formats: [
        {
          title: "Headers", items: [
            { title: "Header 1", format: "h1" },
            { title: "Header 2", format: "h2" },
            { title: "Header 3", format: "h3" },
            { title: "Header 4", format: "h4" },
            { title: "Header 5", format: "h5" },
            { title: "Header 6", format: "h6" }
          ]
        },
        {
          title: "Inline", items: [
            { title: "Bold", icon: "bold", format: "bold" },
            { title: "Italic", icon: "italic", format: "italic" },
            { title: "Underline", icon: "underline", format: "underline" },
            { title: "Strikethrough", icon: "strikethrough", format: "strikethrough" },
            { title: "Superscript", icon: "superscript", format: "superscript" },
            { title: "Subscript", icon: "subscript", format: "subscript" },
            { title: "Code", icon: "code", format: "code" }
          ]
        },
        {
          title: "Blocks", items: [
            { title: "Paragraph", format: "p" },
            { title: "Blockquote", format: "blockquote" },
            { title: "Div", format: "div" },
            { title: "Pre", format: "pre" }
          ]
        },
        {
          title: "Alignment", items: [
            { title: "Left", icon: "alignleft", format: "alignleft" },
            { title: "Center", icon: "aligncenter", format: "aligncenter" },
            { title: "Right", icon: "alignright", format: "alignright" },
            { title: "Justify", icon: "alignjustify", format: "alignjustify" }
          ]
        }
      ],
      skin_url: 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });
      },
    });

    if(this.editor && this.value && !this.didSetValue) {
      this.didSetValue = true;
      this.editor.setContent(this.value);
    }
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  ngOnInit() {
  }

}
