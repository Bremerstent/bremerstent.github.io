/* eslint-disable no-undef, no-unused-vars */


p5.disableFriendlyErrors = true; // disables FES

//doodleClass

var canvas;

let pBrush, brushTex;

let pensel;
let rotX = 0;

function preload() {
  //preload img

  //preload brush, tex
  pBrush = loadModel("billeder/mthurn/brush.obj");
  brushTex = loadImage("billeder/mthurn/brushTex.png");
}

function setup() {
  //doodle
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");

  frameRate(20);

  pensel = {
    //posisjon, størrelse,
    x: 0,
    y: 0,
    z: 0,
    startX: width / 20,
    startY: height / 20,
    grenseX: width / 4,
    grenseY: height / 4,
    lengde: 100,

    //bevegelse i X og Y
    spdX: 30,
    spdY: 30,
    //form,osv
    malVekt: 2,

    //spor
    historyX: [],
    historyY: [],

    paa: true, //av-på

    beveg: function () {
      //kan gjere om movement til vector... meir spanande
      this.x += random(-this.spdX, this.spdX);
      this.y += random(-this.spdY, this.spdY);

      //constraining ... det her bør optimaliserast.
      if (this.x >= this.grenseX) {
        this.x -= this.startX;

        //event!
      } else if (this.y >= this.grenseX) {
        this.y -= this.startY;
      } else if (this.y <= -this.grenseY) {
        this.y += this.startY;
      } else if (this.x <= -this.grenseX) {
        this.x += this.startX;
      }

      //rebound
    },

    lerret: function () {
      push();
      rectMode(CENTER);
      //noStroke();
      strokeWeight(1);

      rect(0, 4, width / 1.5);
      pop();
    },

    /*Burde eigentleg bruke vector her, men vector gjer at det kræsja... kanskje en infinite loop der elns.
    husk å legge til Z om eg vil ha 3D.*/

    brush: function () {
      //slice ut siste del av arrayet..

      //originS

      push();
      translate(this.x, this.y, this.z + 55);

      noStroke();
      texture(brushTex);
      scale(6);
      model(pBrush);

      normalMaterial();

      pop();
    }, //nokre problem her med dithering eller wtf

    //eit array med tidligare posisjonar
    spor: function (r, g, b) {
      this.historyX.push(Math.round(this.x));
      this.historyY.push(Math.round(this.y));
      //passe på at dei greiene her ikkje blir for lange... f.eks 500?
      //altså om den når length 500 eller større slettar eg dei to første posisjonane frå arrayet

      // ekje her problemet ligge
      if (this.historyX.length >= this.lengde && this.paa) {
        this.historyX.splice(0, 2);
      }
      if (this.historyY.length >= this.lengde && this.paa) {
        this.historyY.splice(0, 2);
      }

      //lengde -1 ffs ...
      for (let i = 0; i < this.historyX.length - 1; i++) {
        stroke(r, g, b);

        strokeWeight(this.malVekt);

        line(
          pensel.historyX[i],
          pensel.historyY[i],
          pensel.historyX[i + 1],
          pensel.historyY[i + 1]
        );
      }
    },

    form: function (r, g, b) {
      stroke(r, g, b);
      // point(this.x, this.y);

      strokeWeight(this.malVekt);
    },

    kontroll: function () {
      if (this.paa) {
        this.beveg();
        this.spor(0, 0, 0);
        this.brush();
      } else {
        this.spor();
        this.brush();
        // this.lerret();

        //line fraa start til slutts
        line(pensel.x, pensel.y, pensel.historyX[0], pensel.historyY[0]);
      }
    }
  };
}

function mousePressed() {
  pensel.paa = !pensel.paa; // NOT-operator. false blir true og vice versa
}

function draw() {
  rotateY((rotX = rotX + 0.001));
  background("white");

  rotateY(rotX);
  // rotX += 0.004;

  pensel.kontroll();

  //console.log(Math.round(frameRate()));

  //console.log("width: " + width)
  //console.log("height: " + height)
  //console.log("pensel X: " + pensel.x)
  //console.log("pensel Y: " + pensel.y)

  //squiggletest:

  orbitControl();

  // console.log(pensel.historyX,pensel.historyY);
}
