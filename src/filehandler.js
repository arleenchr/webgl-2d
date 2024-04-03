function downloadJSON(data){
    var blob = new Blob([data], {type: 'application/json'});
    var url= URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'models';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function loadJSON(){
    return new Promise((resolve, reject) => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        models = [];
        
        var reader = new FileReader();
        reader.onload = function(event) {
          var json = event.target.result;
          try {
            var models = JSON.parse(json);
            resolve(models);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      });
}