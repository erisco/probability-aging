"use strict";

window.onload = function () {

  var numPoints = 10;

  // 2 arrays of float64s
  var buffer = new ArrayBuffer(8 * numPoints * 2);
  var preimage = new Float64Array(buffer, 0, numPoints);
  var image = new Float64Array(buffer, 8 * numPoints, numPoints);

  // randomize dataset
  var sum = 0.0;
  for (var i = 0; i < numPoints; ++i) {
    preimage[i] = Math.random();
    sum += preimage[i];
  }
  for (var i = 0; i < numPoints; ++i) {
    preimage[i] = preimage[i] / sum;
  }

  var q = 0.0;
  var s = 0.0;

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var qSlider = document.getElementById("q-slider");
  var sSlider = document.getElementById("s-slider");
  var starter = document.getElementById("start");
  var stopper = document.getElementById("stop");
  q = parseFloat(qSlider.value);
  s = parseFloat(sSlider.value);

  qSlider.addEventListener("input", function (e) {
    q = parseFloat(qSlider.value);
    transform(preimage, image, q, s);
    drawDataSet(canvas, ctx, image);
  });
  sSlider.addEventListener("input", function (e) {
    s = parseFloat(sSlider.value);
    transform(preimage, image, q, s);
    drawDataSet(canvas, ctx, image);
  });

  var stepper = function (e) {
    if (s + 0.01 <= 1.0) {
      s += 0.01;
    }
    else {
      s = 1.0;
    }
    sSlider.value = s;
    transform(preimage, image, q, s);
    drawDataSet(canvas, ctx, image);
  };
  var stepperInterval;
  starter.addEventListener("click", function (e) {
    stepperInterval = setInterval(stepper, 30);
  });
  stopper.addEventListener("click", function (e) {
    clearInterval(stepperInterval);
  });

  drawDataSet(canvas, ctx, preimage);

};


function transform(preimage, image, q, s)
{

  var limit = preimage.length;

  // Find maximal point
  var maxX = 0;
  for (var i = 0; i < limit; ++i) {
    if (preimage[i] > maxX) {
      maxX = preimage[i];
    }
  }

  // Compute lower sum and transform lower partition.
  // Compute higher sum.
  var sumLower = 0;
  var sumHigher = 0;
  for (var i = 0; i < limit; ++i) {
    if (maxX - preimage[i] > q * maxX) {
      sumLower += preimage[i];
      image[i] = (1.0 - s) * preimage[i];
    }
    else {
      sumHigher += preimage[i];
    }
  }

  // Trasform higher partition.
  for (var i = 0; i < limit; ++i) {
    if (maxX - preimage[i] <= q * maxX) {
      image[i] = (preimage[i] / sumHigher) * s * sumLower + preimage[i];
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
