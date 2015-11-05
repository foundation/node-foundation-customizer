!function($, Foundation, window){
  function Move(duration, elem, fn){
    var anim, prog, start = null, _this = this;

    this.do = function(ts){//timestamp returned from requestAnimationFrame
      if(!start){ start = ts; }
      prog = ts - start;
      fn.apply(elem);//call the cb

      if(prog < duration){
        anim = window.requestAnimationFrame(_this.do, elem);
      }else{
        window.cancelAnimationFrame(anim);
        elem.trigger('finished.zf.animate', [elem]);
      }
    };
    window.requestAnimationFrame(this.do);
  }
  Foundation.Move = Move;
}(jQuery, window.Foundation, window);
