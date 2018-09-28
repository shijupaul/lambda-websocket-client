var rekognitionData = [];
var es = new EventSource('https://294791b2.fanoutcdn.com/prod/events');

es.addEventListener('message', function (event) {
  let imageUploaded = JSON.parse(event.data);
  let imageUrl = `https://s3-eu-west-1.amazonaws.com/s3-image-recognition/${imageUploaded.image}`;
  storeRekognitionData(imageUrl, imageUploaded.labels);
  redrawImages();
  scrollToBottom();
}, false);

function handleImageAdd(imageUrl) {
  let anchor = jQuery('<a></a>');
  anchor.attr('href', '#');
  let image = jQuery('<img></img>');
  image.attr('src', imageUrl);
  anchor.append(image);
  jQuery('#users').append(anchor);
}

function storeRekognitionData(imageUrl, labels) {
   rekognitionData = rekognitionData.filter(function(data) {
    return data.imageUrl !== imageUrl;
  })
  rekognitionData.push({imageUrl,labels});
}

function redrawImages() {
  jQuery('#users').html('');
  rekognitionData.forEach(function(data) {
    let anchor = jQuery('<a></a>');
    anchor.attr('href', '#');
    let image = jQuery('<img></img>');
    image.attr('src', data.imageUrl);
    anchor.append(image);
    jQuery('#users').append(anchor);
  })
}

function scrollToBottom() {
  var messageList = jQuery('#users');
  var newMessage = messageList.children('a:last-child');

  var scrollHeight = messageList.prop('scrollHeight');
  var scrollTop = messageList.prop('scrollTop');
  var clientHeight = messageList.prop('clientHeight');
  var newMessageHeight = newMessage.children('img:last-child').outerHeight(true);
  var lastMessageHeight = newMessage.prev().children('img:last-child').outerHeight(true);

  console.log('sum:', scrollTop + clientHeight  + newMessageHeight + lastMessageHeight);
  console.log('scrollHeight:', scrollHeight);
  if (scrollTop + clientHeight  + newMessageHeight + lastMessageHeight>= scrollHeight) {
    let result = messageList.scrollTop(scrollHeight);
    console.log('decision taken to scroll, Outcome:', result);
  }
}

jQuery('#users').on('click','a' ,function(e) {
  console.log('clicked', e);
  console.log(e.target.currentSrc)
  let image = rekognitionData.filter(function(data) {
    return data.imageUrl === e.target.currentSrc;
  })
  console.log(image);
  showImage(image[0].imageUrl);
  showRekognition(image[0].labels);
});

function showImage(imageUrl) {
  jQuery('#imageViewer').html('');
  let image = jQuery('<img></img>');
  image.attr('src', imageUrl);
  jQuery('#imageViewer').append(image);
}

function showRekognition(labels) {
  jQuery('#imageRecogOutput').html('');
  let table = jQuery('<table></table>');
  let trHeader = jQuery('<tr></tr>');
  let thLabel = jQuery('<th></th>').html('Label');
  let thConfidence = jQuery('<th></th>').html('Confidence');
  table.append(trHeader);
  trHeader.append(thLabel);
  trHeader.append(thConfidence);

  labels.forEach(function(label) {
    let trData = jQuery('<tr></tr>');
    let tdLabel = jQuery('<td></td>').html(label.label);
    let tdConfidence = jQuery('<td></td>').html(label.confidence);
    trData.append(tdLabel);
    trData.append(tdConfidence);
    table.append(trData);
  });
  table.addClass('hovertable');
  table.css('width', '100%');
  jQuery('#imageRecogOutput').append(table);
}
