"use strict";

window.onload = function () {

  var numPoints = 10;

  // 200 float64s
  var buffer = new ArrayBuffer(8 * numPoints);
  var dataset = new Float64Array(buffer, 0, numPoints);

  // randomize dataset
  var sum = 0.0;
  for (var i = 0; i < numPoints; ++i) {
    dataset[i] = Math.random();
    sum += dataset[i];
  }
  for (var i = 0; i < numPoints; ++i) {
    dataset[i] = dataset[i] / sum;
  }

  var q = 0.0;
  var s = 0.0;
  var t = 0;

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var qSlider = document.getElementById("q-slider");
  var sSlider = document.getElementById("s-slider");
  var tSlider = document.getElementById("t-slider");
  var starter = document.getElementById("start");
  var stopper = document.getElementById("stop");
  q = qSlider.value;
  s = sSlider.value;
  t = tSlider.value;

  qSlider.addEventListener("input", function (e) {
    q = qSlider.value;
  });
  sSlider.addEventListener("input", function (e) {
    s = sSlider.value;
  });
  tSlider.addEventListener("input", function (e) {
    var delta = tSlider.value - t;
    t = tSlider.value;
    for (var i = 0; i < delta; ++i) {
      transform(dataset, q, s);
    }
    drawDataSet(canvas, ctx, dataset);
  });

  var stepper = function (e) {
    transform(dataset, q, s);
    drawDataSet(canvas, ctx, dataset);
  };
  var stepperInterval;
  starter.addEventListener("click", function (e) {
    stepperInterval = setInterval(stepper, 100);
  });
  stopper.addEventListener("click", function (e) {
    clearInterval(stepperInterval);
  });

  drawDataSet(canvas, ctx, dataset);

};


function transform(dataset, q, s)
{

  var limit = dataset.length;

  // Find maximal point
  var maxX = 0;
  for (var i = 0; i < limit; ++i) {
    if (dataset[i] > maxX) {
      maxX = dataset[i];
    }
  }

  // Compute lower sum and transform lower partition.
  // Compute higher sum.
  var sumLower = 0;
  var sumHigher = 0;
  for (var i = 0; i < limit; ++i) {
    if (maxX - dataset[i] > q * maxX) {
      sumLower += dataset[i];
      dataset[i] = (1.0 - s) * dataset[i];
    }
    else {
      sumHigher += dataset[i];
    }
  }

  // Trasform higher partition.
  for (var i = 0; i < limit; ++i) {
    if (maxX - dataset[i] <= q * maxX) {
      dataset[i] = (dataset[i] / sumHigher) * s * sumLower + dataset[i];
    }
  }

}


function drawDataSet(canvas, ctx, dataset)
{
  var height = canvas.height;
  var spacing = canvas.width / dataset.length;
  var limit = dataset.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < limit; ++i) {
    ctx.fillRect(i * spacing, height - height * dataset[i], 4, 4);
  }
}
