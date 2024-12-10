let img,

  santaHats = [],
  selected = -1,
  scaling = -1,
  rotating = -1;

const url = "https://awdev1.github.io/santa/hat.png";

function preload() {
  santaHats.push({ x: windowWidth - 100, y: 150, scalex: 0.3, scaley: 0.3, rot: 0.3, image: loadImage(url) });
}

function setup() {
  createCanvas(windowWidth, windowHeight).id("canvs");
  pixelDensity(1);

  // modified from p5 source
  const input = document.getElementById('fileHidden');
  input.addEventListener('change', evt => {
    if (!evt.target.files.length || !evt.target.files[0]) return;
    const file = evt.target.files[0];

    var reader = new FileReader();
    function makeLoader(theFile) {
      var p5file = new p5.File(theFile);
      return function(e) {
        img = createImg(e.target.result, '');
        img.hide();
      };
    };

    reader.onload = makeLoader(file);

    if (file.type.indexOf('text') > -1) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  }, false);

  const button = document.getElementById('saveButton');
  button.addEventListener('click', () => {
    if (!img) return;

    scaling = -1;
    rotating = -1;
    selected = -1;
    draw();

    const canvas = document.getElementById('canvs');
    const newCanvas = document.createElement('canvas');
    newCanvas.width = img.width;
    newCanvas.height = img.height;
    newCanvas.getContext('2d').drawImage(canvas, -width / 2 + img.width / 2, -height / 2 + img.height / 2);

    newCanvas.toBlob(blob => saveAs(blob, "santa-hat.png"));
  }, false);

  imageMode(CENTER, CENTER);
  rectMode(CENTER, CENTER);
}

function draw() {
  background(255);
  if (!img) return;

  image(img, width / 2, height / 2);
  cursor(ARROW);

  let i = 0;
  for (let santaHat of santaHats) {
    push();
    translate(santaHat.x, santaHat.y);
    rotate(-santaHat.rot);
    scale(santaHat.scalex, santaHat.scaley);
    image(santaHat.image, 0, 0);
    if (i === selected || i === scaling || i === rotating) {
      noFill();
      stroke(0, 100, 200);
      strokeWeight(2);
      rect(0, 0, santaHat.image.width, santaHat.image.height);
      line(0, -santaHat.image.height / 2, 0, -santaHat.image.height / 2 - 80 * Math.max(santaHat.scalex, santaHat.scaley));

      noStroke();
      fill(0, 50, 225);
      ellipse(santaHat.image.width / 2, santaHat.image.height / 2, 40 / santaHat.scalex * Math.max(santaHat.scalex, santaHat.scaley), 40 / santaHat.scaley * Math.max(santaHat.scalex, santaHat.scaley));
      ellipse(0, -santaHat.image.height / 2 - 80 * Math.max(santaHat.scalex, santaHat.scaley), 40 / santaHat.scalex * Math.max(santaHat.scalex, santaHat.scaley), 40 / santaHat.scaley * Math.max(santaHat.scalex, santaHat.scaley));

      const mx = (mouseX - santaHat.x) * Math.cos(santaHat.rot) - (mouseY - santaHat.y) * Math.sin(santaHat.rot) + santaHat.x,
        my = (mouseX - santaHat.x) * Math.sin(santaHat.rot) + (mouseY - santaHat.y) * Math.cos(santaHat.rot) + santaHat.y;

      if (dist(mx, my, santaHat.x + santaHat.image.width / 2 * santaHat.scalex, santaHat.y + santaHat.image.height / 2 * santaHat.scaley) < 20) {
        cursor(santaHat.scalex * santaHat.scaley > 0 ? 'nwse-resize' : 'nesw-resize');
      } else if (dist(mx, my, santaHat.x, santaHat.y - (santaHat.image.height / 2 + 80 * Math.max(santaHat.scalex, santaHat.scaley)) * santaHat.scaley) < 20) {
        cursor('pointer');
      } else if (mx > santaHat.x - santaHat.image.width * Math.abs(santaHat.scalex) / 2 && mx < santaHat.x + santaHat.image.width * Math.abs(santaHat.scalex) / 2 && my > santaHat.y - santaHat.image.height * Math.abs(santaHat.scaley) / 2 && my < santaHat.y + santaHat.image.height * Math.abs(santaHat.scaley) / 2) {
        cursor('move');
      }
    }
    pop();
    i++;
  }
}

function mousePressed() {
  selected = -1;
  scaling = -1;
  rotating = -1;

  let i = 0;
  for (let santaHat of santaHats) {
    const mx = (mouseX - santaHat.x) * Math.cos(santaHat.rot) - (mouseY - santaHat.y) * Math.sin(santaHat.rot) + santaHat.x,
      my = (mouseX - santaHat.x) * Math.sin(santaHat.rot) + (mouseY - santaHat.y) * Math.cos(santaHat.rot) + santaHat.y;

    const w = Math.abs(santaHat.image.width * santaHat.scalex),
      h = Math.abs(santaHat.image.height * santaHat.scaley);
    if (dist(mx, my, santaHat.x + santaHat.image.width / 2 * santaHat.scalex, santaHat.y + santaHat.image.height / 2 * santaHat.scaley) < 20) {
      scaling = i;
      break;
    }
    if (dist(mx, my, santaHat.x, santaHat.y - (santaHat.image.height / 2 + 80 * Math.max(santaHat.scalex, santaHat.scaley)) * santaHat.scaley) < 20) {
      rotating = i;
      break;
    }
    if (mx > santaHat.x - w / 2 && mx < santaHat.x + w / 2 && my > santaHat.y - h / 2 && my < santaHat.y + h / 2) {
      selected = i;
      break;
    }

    i++;
  }
}

function mouseDragged() {
  if (selected !== -1) {
    santaHats[selected].x = mouseX;
    santaHats[selected].y = mouseY;
  }

  if (scaling !== -1) {
    const mx = (mouseX - santaHats[scaling].x) * Math.cos(santaHats[scaling].rot) - (mouseY - santaHats[scaling].y) * Math.sin(santaHats[scaling].rot) + santaHats[scaling].x,
      my = (mouseX - santaHats[scaling].x) * Math.sin(santaHats[scaling].rot) + (mouseY - santaHats[scaling].y) * Math.cos(santaHats[scaling].rot) + santaHats[scaling].y;

    santaHats[scaling].scalex = (mx - santaHats[scaling].x) / (santaHats[scaling].image.width / 2);
    santaHats[scaling].scaley = (my - santaHats[scaling].y) / (santaHats[scaling].image.height / 2);
  }

  if (rotating !== -1) {
    santaHats[rotating].rot = Math.PI + Math.atan2(mouseX - santaHats[rotating].x, mouseY - santaHats[rotating].y);
  }
}
