
'use strict'

var buffer_size = 1024;

var bci_plot: CanvasPlotter;
var bci_data: DataCollector;

window.addEventListener('load', function() {

  var canvas_container = document.getElementById('canvas_container');

  bci_data = new DataCollector(8, buffer_size, true);
  bci_plot = new CanvasPlotter(canvas_container, bci_data);

});

interface DataSet {

  data: Int32Array;
  max_value: number;
}

interface ComplexArray {
  length: number,
  re: Int32Array,
  im: Int32Array,
  maxre?: number
}

interface Transform {
  scaleX: number,
  scaleY: number,
  dx: number,
  dy: number
}

class CanvasPlotter {

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  static GRAPH_HEIGHT = 50; // half of excursion
  static transform: Transform[] = [
    { scaleX: 1, scaleY: 1, dx: 0, dy: 50 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 150 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 250 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 350 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 450 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 550 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 650 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 750 }
  ];
  static signal_color = [
    '#FF4444',
    '#44FF44',
    '#4444FF',
    "#FF44FF",
    '#44FFFF',
    '#FFFF44',
    '#4444FF',
    "#FF44FF"
  ];
  static axis_color = [
    '#FFAAAA',
    '#AAFFAA',
    '#AAAAFF',
    "#FFAAFF",
    '#AAFFFF',
    '#FFFFAA',
    '#AAAAFF',
    "#FFAAFF"
  ];

  dataset: DataCollector;

  constructor(container: HTMLElement, datacoll: DataCollector) {
    if (datacoll.datasets.length > 8) {
      throw "CanvasPlotter can only manage 8 channels";
    }

    this.dataset = datacoll;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext("2d");

    this.canvas.width = 1800;
    this.canvas.height = CanvasPlotter.GRAPH_HEIGHT * 2 * this.dataset.datasets.length;

    container.appendChild(this.context.canvas);
    
    this._drawGrid(); 
  }

  redraw = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._drawGrid();
    this._drawData();
    this._drawFFT(this.dataset.fftsets);
  }

  private _drawGrid() {

    var ctx = this.context;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#C0C0C0';

    for (var x = 0; x < this.canvas.width; x += 50) {
      ctx.beginPath(), ctx.moveTo(x, 0), ctx.lineTo(x, this.canvas.height), ctx.stroke()
    }
    for (var y = 0; y < this.canvas.height; y += 50) {
      ctx.beginPath(), ctx.moveTo(0, y), ctx.lineTo(this.canvas.width, y), ctx.stroke()
    }
  }

  private _drawData() {

    var ctx = this.context;
    var t: Transform;

    ctx.lineWidth = 1;

    for (var c = 0; c < this.dataset.datasets.length; c++) {

      var data = this.dataset.datasets[c].data;
      var max_value = this.dataset.datasets[c].max_value;
      var write_position = this.dataset.write_position;

      ctx.save();

      t = CanvasPlotter.transform[c];

      // ctx.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);
      ctx.setTransform(t.scaleX, 0, 0, t.scaleY, t.dx, t.dy);

      ctx.strokeStyle = CanvasPlotter.axis_color[c];
      ctx.beginPath(), ctx.moveTo(0, 0), ctx.lineTo(data.length, 0), ctx.stroke()

      ctx.save();
      ctx.setTransform(t.scaleX, 0, 0, -t.scaleY / max_value * CanvasPlotter.GRAPH_HEIGHT, t.dx, t.dy);
      ctx.strokeStyle = CanvasPlotter.signal_color[c];
      ctx.beginPath();
      ctx.moveTo(0, data[0]);

      for (var x = 1; x < data.length; x++) {
        ctx.lineTo(x, data[x]);
      }

      ctx.stroke();

      ctx.strokeStyle = CanvasPlotter.axis_color[c];
      ctx.beginPath(), ctx.moveTo(write_position, - max_value), ctx.lineTo(write_position, max_value), ctx.stroke();

      ctx.restore();

      ctx.fillStyle = CanvasPlotter.signal_color[c];
      ctx.fillText(max_value.toString(), 0, CanvasPlotter.GRAPH_HEIGHT - 2);
      if (write_position > 0) // TODO (1) : test does not matter for one single step, data[-1] returns undefined and does not throw error exept with toString()
        ctx.fillText(data[write_position - 1].toString(), write_position, 10 - CanvasPlotter.GRAPH_HEIGHT); // TODO : (ctx.measureText() * wh_ratio)

      ctx.restore();
    }
  }

  private _drawFFT(fftset: ComplexArray[]) {

    var ctx = this.context;

    var t: Transform;

    for (var c = 0; c < fftset.length; c++) {

      // var data = datasets[channel];
      ctx.save();

      t = CanvasPlotter.transform[c];

      // ctx.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);
      ctx.setTransform(t.scaleX, 0, 0, -t.scaleY / fftset[c].maxre * CanvasPlotter.GRAPH_HEIGHT * 2, t.dx + buffer_size + 20, t.dy + CanvasPlotter.GRAPH_HEIGHT);

      ctx.strokeStyle = CanvasPlotter.axis_color[c];
      ctx.beginPath(), ctx.moveTo(0, 0), ctx.lineTo(fftset[c].length, 0), ctx.stroke()

      ctx.save();
      //  ctx.setTransform(t.scaleX, 0, 0, -t.scaleY / fftset[c].re.max_value * (canvas.GRAPH_HEIGHT), t.dx, t.dy);
      ctx.strokeStyle = CanvasPlotter.signal_color[c];
      ctx.beginPath();
      ctx.moveTo(0, fftset[c].re[0]);

      for (var x = 1; x < fftset[c].re.length / 2; x++) {
        ctx.lineTo(x, fftset[c].re[x]);
      }

      ctx.stroke();

      ctx.restore();

      ctx.restore();
    }
  }
}

class DataCollector {

  // channel_count: number; => datasets.length
  calc_fft = false;
  buffer_length: number;
  write_position = 0;
  datasets: DataSet[] = [];
  fftsets: ComplexArray[] = [];

  private write_marker = 0;

  constructor(channel_count: number, buf_len: number, calculate_fft: boolean) {
 
    this.calc_fft = calculate_fft;
    // this.channel_count = channel_count;
    this.buffer_length = buf_len;

    for (var c = 0; c < channel_count; c++) {

      this.datasets[c] = { data: new Int32Array(buf_len), max_value: 0 };

      if (this.calc_fft) {
        this.fftsets[c] = { length: buf_len, re: new Int32Array(buf_len), im: new Int32Array(buf_len) };
      }
    }
  }

  feed (frame: number[]) {

    for (var c = 0 ; c < this.datasets.length ; c++ ) {
      this.datasets[c].data[this.write_marker] = frame[c];
      this.datasets[c].max_value = Math.max(Math.abs(frame[c]), this.datasets[c].max_value);
    }

    this.write_marker++;

    if (this.write_marker === this.buffer_length) {

      this.write_marker = 0;
      for (var c = 0 ; c < this.datasets.length ; c++ ) {
        this.datasets[c].max_value = 0;
      }

      if (this.calc_fft) {
        for (var c = 0 ; c < this.fftsets.length ; c++ ) {
          this.fftsets[c].re.set(this.datasets[c].data);
          fft(1, this.fftsets[c].re.length, this.fftsets[c].re, this.fftsets[c].im);

          var max = 0;
          for (var i = 0 ; i < this.fftsets[c].re.length / 2 ; i++) {
            this.fftsets[c].re[i] = Math.abs(this.fftsets[c].re[i]);
            max = Math.max(max, this.fftsets[c].re[i]);
          }
          this.fftsets[c].maxre = max;
        }
      }
    }

    this.write_position = this.write_marker; // TODO (0) : unify ?
  }   
}


var fft = function(Ind: number, Npair: number, Ar: Int32Array, Ai: Int32Array) {
    /*=========================================
     * Calculate the floating point complex FFT
     * Ind = +1 => FORWARD FFT
     * Ind = -l => INVERSE FFT
     * Data is passed in Npair Complex pairs
     * where Npair is power of 2 (2^N)
     * data is indexed from 0 to Npair-1
     * Real data in Ar
     * Imag data in Ai.
     *
     * Output data is returned in the same arrays,
     * DC in bin 0, +ve freqs in bins 1..Npair/2
     * -ve freqs in Npair/2+1 .. Npair-1.
     *
     * ref: Rabiner & Gold
     * "THEORY AND APPLICATION OF DIGITAL
     *  SIGNAL PROCESSING" p367
     *
     * Translated to JavaScript by A.R.Collins
     * <http://www.arc.id.au>
     *========================================*/

    var Pi = Math.PI;
    var Num1: number, Num2: number, i: number, j: number, k: number, L: number;
    var m: number, Le: number, Le1: number;
    var Tr: number, Ti: number, Ur: number, Ui: number, Xr: number, Xi: number, Wr: number, Wi: number, Ip: number;

    function isPwrOf2(n: number)
    {
      var p = -1;
      for (p=2; p<13; p++)
      {
        if (Math.pow(2,p) === n)
        {
          return p;
        }
      }
      return -1;
    }

    m = isPwrOf2(Npair);
    if (m<0)
    {
      alert("Npair must be power of 2 from 4 to 4096");
      return;
    }

    Num1 = Npair-1;
    Num2 = Npair/2;
    // if IFT conjugate prior to transforming:
    if (Ind < 0)
    {
      for(i = 0; i < Npair; i++)
      {
        Ai[i] *= -1;
      }
    }

    j = 0;    // In place bit reversal of input data
    for(i = 0; i < Num1; i++)
    {
      if (i < j)
      {
        Tr = Ar[j];
        Ti = Ai[j];
        Ar[j] = Ar[i];
        Ai[j] = Ai[i];
        Ar[i] = Tr;
        Ai[i] = Ti;
      }
      k = Num2;
      while (k < j+1)
      {
        j = j-k;
        k = k/2;
      }
      j = j+k;
    }

    Le = 1;
    for(L = 1; L <= m; L++)
    {
      Le1 = Le;
      Le += Le;
      Ur = 1;
      Ui = 0;
      Wr = Math.cos(Pi/Le1);
      Wi = -Math.sin(Pi/Le1);
      for(j = 1; j <= Le1; j++)
      {
        for(i = j-1; i <= Num1; i += Le)
        {
          Ip = i+Le1;
          Tr = Ar[Ip]*Ur-Ai[Ip]*Ui;
          Ti = Ar[Ip]*Ui+Ai[Ip]*Ur;
          Ar[Ip] = Ar[i]-Tr;
          Ai[Ip] = Ai[i]-Ti;
          Ar[i] = Ar[i]+Tr;
          Ai[i] = Ai[i]+Ti;
        }
        Xr = Ur*Wr-Ui*Wi;
        Xi = Ur*Wi+Ui*Wr;
        Ur = Xr;
        Ui = Xi;
      }
    }
    // conjugate and normalise
    if(Ind<0)
    {
      for(i=0; i<Npair; i++)
      {
        Ai[i] *= -1;
      }
    }
    else
    {
      for(i=0; i<Npair; i++)
      {
        Ar[i] /= Npair;
        Ai[i] /= Npair;
      }
    }
};

