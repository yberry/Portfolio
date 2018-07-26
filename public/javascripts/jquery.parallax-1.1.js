(function (e) {
    e.fn.parallax = function (t, n, r, i) {
        function s(t, n) {
            n.each(function () {
                var n = e(this);
                var r = n.offset().top;
                if (i === true) {
                    var s = n.outerHeight(true)
                } else {
                    var s = n.height()
                }
                if (r + s >= t && r + s - u < t) {
                    c(t, s)
                }
                if (r <= t && r + s >= t && r - u < t && r + s - u > t) {
                    c(t, s)
                }
                if (r + s > t && r - u < t && r > t) {
                    c(t, s)
                }
            })
        }
        function l(e, t, n, r, i) {
            return e + " " + Math.round(-(t + n - r) * i) + "px"
        }
        function c(e, i) {
            f.css({ backgroundPosition: l(t, i, e, n, r) })
        }
        var o = e(window);
        var u = e(window).height();
        var a = o.scrollTop();
        var f = e(this);
        if (t === null) {
            t = "50%"
        }
        if (n === null) {
            n = 0
        }
        if (r === null) {
            r = .1
        }
        if (i === null) {
            i = true
        }
        height = f.height();
        f.css({ backgroundPosition: l(t, i, n, r) });
        o.bind("scroll", function () {
            var t = o.scrollTop();
            s(t, f);
            e("#pixels").html(t)
        })
    }
})(jQuery)