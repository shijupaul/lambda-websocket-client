var fileUploader  = jQuery('#file-upload');
var fileUploaderLabel = jQuery('.custom-file-upload');
fileUploader.on('change',function (event)
{
  console.log(event);
  if (event.target.files.length > 0) {
    fileUploader.attr('disabled', 'disabled');
    fileUploaderLabel.text('Sending file.....');
    let file = event.target.files[0];
    console.log('file selected', file);


    var formData = new FormData();
    formData.append('file', event.target.files[0]);

    jQuery.ajax({
           url : 'upload',
           type : 'POST',
           data : formData,
           processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
           success : function(data) {
               console.log(data);
               fileUploader.removeAttr('disabled')
               fileUploaderLabel.text('File upload');
           },
           failure: function(data) {
             console.log(data);
             fileUploader.removeAttr('disabled')
             fileUploaderLabel.text('File upload');
           }

    });
  }
});
