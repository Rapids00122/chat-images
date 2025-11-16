const Re = (h) => $(h), Pt = (h, g) => h.before(g), fe = (h, g) => g ? g.find(h) : $(h), _e = (h, g) => h.append(g), Pe = (h, g, y) => h.on(g, y), Dt = (h, g) => h.trigger(g), Lt = (h, g) => h.removeClass(g), Je = (h, g) => h.addClass(g), Ve = (h) => h.remove(), Ot = (h, g, y) => h.attr(g, y), Bt = (h, g) => h.removeAttr(g), Qt = (h) => h.focus(), Be = "data", Ae = (h) => game?.i18n?.localize(`CI.${h}`) || "", ht = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), gt = (h = !1) => {
  const g = game?.user?.role, y = game?.permissions?.FILES_UPLOAD;
  if (!g || !y)
    return h || ui.notifications?.warn(Ae("uploadPermissions")), !1;
  const i = y.includes(g);
  return !i && !h && ui.notifications?.warn(Ae("uploadPermissions")), i;
}, Nt = () => game?.version, ke = () => Number(Nt()) >= 13, Qe = () => ke() ? foundry.applications.apps.FilePicker.implementation : FilePicker, zt = () => ke() ? foundry.applications.apps.ImagePopout : ImagePopout, $t = () => Re('<div id="ci-chat-upload-area" class="hidden"></div>'), at = (h) => {
  const g = ke() ? ".chat-controls" : "#chat-controls", y = fe(g, h), i = $t();
  Pt(y, i);
};
function Wt(h, g) {
  return g.forEach((function(y) {
    y && typeof y != "string" && !Array.isArray(y) && Object.keys(y).forEach((function(i) {
      if (i !== "default" && !(i in h)) {
        var e = Object.getOwnPropertyDescriptor(y, i);
        Object.defineProperty(h, i, e.get ? e : { enumerable: !0, get: function() {
          return y[i];
        } });
      }
    }));
  })), Object.freeze(h);
}
function pt(h, g) {
  return new Promise((function(y, i) {
    let e;
    return qt(h).then((function(t) {
      try {
        return e = t, y(new Blob([g.slice(0, 2), e, g.slice(2)], { type: "image/jpeg" }));
      } catch (c) {
        return i(c);
      }
    }), i);
  }));
}
const qt = (h) => new Promise(((g, y) => {
  const i = new FileReader();
  i.addEventListener("load", (({ target: { result: e } }) => {
    const t = new DataView(e);
    let c = 0;
    if (t.getUint16(c) !== 65496) return y("not a valid JPEG");
    for (c += 2; ; ) {
      const f = t.getUint16(c);
      if (f === 65498) break;
      const m = t.getUint16(c + 2);
      if (f === 65505 && t.getUint32(c + 4) === 1165519206) {
        const U = c + 10;
        let r;
        switch (t.getUint16(U)) {
          case 18761:
            r = !0;
            break;
          case 19789:
            r = !1;
            break;
          default:
            return y("TIFF header contains invalid endian");
        }
        if (t.getUint16(U + 2, r) !== 42) return y("TIFF header contains invalid version");
        const o = t.getUint32(U + 4, r), n = U + o + 2 + 12 * t.getUint16(U + o, r);
        for (let a = U + o + 2; a < n; a += 12)
          if (t.getUint16(a, r) == 274) {
            if (t.getUint16(a + 2, r) !== 3) return y("Orientation data type is invalid");
            if (t.getUint32(a + 4, r) !== 1) return y("Orientation data count is invalid");
            t.setUint16(a + 8, 1, r);
            break;
          }
        return g(e.slice(c, c + 2 + m));
      }
      c += 2 + m;
    }
    return g(new Blob());
  })), i.readAsArrayBuffer(h);
}));
var We = {}, jt = { get exports() {
  return We;
}, set exports(h) {
  We = h;
} };
(function(h) {
  var g, y, i = {};
  jt.exports = i, i.parse = function(e, t) {
    for (var c = i.bin.readUshort, f = i.bin.readUint, m = 0, U = {}, r = new Uint8Array(e), o = r.length - 4; f(r, o) != 101010256; ) o--;
    m = o, m += 4;
    var n = c(r, m += 4);
    c(r, m += 2);
    var a = f(r, m += 2), p = f(r, m += 4);
    m += 4, m = p;
    for (var F = 0; F < n; F++) {
      f(r, m), m += 4, m += 4, m += 4, f(r, m += 4), a = f(r, m += 4);
      var T = f(r, m += 4), w = c(r, m += 4), L = c(r, m + 2), H = c(r, m + 4);
      m += 6;
      var M = f(r, m += 8);
      m += 4, m += w + L + H, i._readLocal(r, M, U, a, T, t);
    }
    return U;
  }, i._readLocal = function(e, t, c, f, m, U) {
    var r = i.bin.readUshort, o = i.bin.readUint;
    o(e, t), r(e, t += 4), r(e, t += 2);
    var n = r(e, t += 2);
    o(e, t += 2), o(e, t += 4), t += 4;
    var a = r(e, t += 8), p = r(e, t += 2);
    t += 2;
    var F = i.bin.readUTF8(e, t, a);
    if (t += a, t += p, U) c[F] = { size: m, csize: f };
    else {
      var T = new Uint8Array(e.buffer, t);
      if (n == 0) c[F] = new Uint8Array(T.buffer.slice(t, t + f));
      else {
        if (n != 8) throw "unknown compression method: " + n;
        var w = new Uint8Array(m);
        i.inflateRaw(T, w), c[F] = w;
      }
    }
  }, i.inflateRaw = function(e, t) {
    return i.F.inflate(e, t);
  }, i.inflate = function(e, t) {
    return e[0], e[1], i.inflateRaw(new Uint8Array(e.buffer, e.byteOffset + 2, e.length - 6), t);
  }, i.deflate = function(e, t) {
    t == null && (t = { level: 6 });
    var c = 0, f = new Uint8Array(50 + Math.floor(1.1 * e.length));
    f[c] = 120, f[c + 1] = 156, c += 2, c = i.F.deflateRaw(e, f, c, t.level);
    var m = i.adler(e, 0, e.length);
    return f[c + 0] = m >>> 24 & 255, f[c + 1] = m >>> 16 & 255, f[c + 2] = m >>> 8 & 255, f[c + 3] = m >>> 0 & 255, new Uint8Array(f.buffer, 0, c + 4);
  }, i.deflateRaw = function(e, t) {
    t == null && (t = { level: 6 });
    var c = new Uint8Array(50 + Math.floor(1.1 * e.length)), f = i.F.deflateRaw(e, c, f, t.level);
    return new Uint8Array(c.buffer, 0, f);
  }, i.encode = function(e, t) {
    t == null && (t = !1);
    var c = 0, f = i.bin.writeUint, m = i.bin.writeUshort, U = {};
    for (var r in e) {
      var o = !i._noNeed(r) && !t, n = e[r], a = i.crc.crc(n, 0, n.length);
      U[r] = { cpr: o, usize: n.length, crc: a, file: o ? i.deflateRaw(n) : n };
    }
    for (var r in U) c += U[r].file.length + 30 + 46 + 2 * i.bin.sizeUTF8(r);
    c += 22;
    var p = new Uint8Array(c), F = 0, T = [];
    for (var r in U) {
      var w = U[r];
      T.push(F), F = i._writeHeader(p, F, r, w, 0);
    }
    var L = 0, H = F;
    for (var r in U)
      w = U[r], T.push(F), F = i._writeHeader(p, F, r, w, 1, T[L++]);
    var M = F - H;
    return f(p, F, 101010256), F += 4, m(p, F += 4, L), m(p, F += 2, L), f(p, F += 2, M), f(p, F += 4, H), F += 4, F += 2, p.buffer;
  }, i._noNeed = function(e) {
    var t = e.split(".").pop().toLowerCase();
    return "png,jpg,jpeg,zip".indexOf(t) != -1;
  }, i._writeHeader = function(e, t, c, f, m, U) {
    var r = i.bin.writeUint, o = i.bin.writeUshort, n = f.file;
    return r(e, t, m == 0 ? 67324752 : 33639248), t += 4, m == 1 && (t += 2), o(e, t, 20), o(e, t += 2, 0), o(e, t += 2, f.cpr ? 8 : 0), r(e, t += 2, 0), r(e, t += 4, f.crc), r(e, t += 4, n.length), r(e, t += 4, f.usize), o(e, t += 4, i.bin.sizeUTF8(c)), o(e, t += 2, 0), t += 2, m == 1 && (t += 2, t += 2, r(e, t += 6, U), t += 4), t += i.bin.writeUTF8(e, t, c), m == 0 && (e.set(n, t), t += n.length), t;
  }, i.crc = { table: (function() {
    for (var e = new Uint32Array(256), t = 0; t < 256; t++) {
      for (var c = t, f = 0; f < 8; f++) 1 & c ? c = 3988292384 ^ c >>> 1 : c >>>= 1;
      e[t] = c;
    }
    return e;
  })(), update: function(e, t, c, f) {
    for (var m = 0; m < f; m++) e = i.crc.table[255 & (e ^ t[c + m])] ^ e >>> 8;
    return e;
  }, crc: function(e, t, c) {
    return 4294967295 ^ i.crc.update(4294967295, e, t, c);
  } }, i.adler = function(e, t, c) {
    for (var f = 1, m = 0, U = t, r = t + c; U < r; ) {
      for (var o = Math.min(U + 5552, r); U < o; ) m += f += e[U++];
      f %= 65521, m %= 65521;
    }
    return m << 16 | f;
  }, i.bin = { readUshort: function(e, t) {
    return e[t] | e[t + 1] << 8;
  }, writeUshort: function(e, t, c) {
    e[t] = 255 & c, e[t + 1] = c >> 8 & 255;
  }, readUint: function(e, t) {
    return 16777216 * e[t + 3] + (e[t + 2] << 16 | e[t + 1] << 8 | e[t]);
  }, writeUint: function(e, t, c) {
    e[t] = 255 & c, e[t + 1] = c >> 8 & 255, e[t + 2] = c >> 16 & 255, e[t + 3] = c >> 24 & 255;
  }, readASCII: function(e, t, c) {
    for (var f = "", m = 0; m < c; m++) f += String.fromCharCode(e[t + m]);
    return f;
  }, writeASCII: function(e, t, c) {
    for (var f = 0; f < c.length; f++) e[t + f] = c.charCodeAt(f);
  }, pad: function(e) {
    return e.length < 2 ? "0" + e : e;
  }, readUTF8: function(e, t, c) {
    for (var f, m = "", U = 0; U < c; U++) m += "%" + i.bin.pad(e[t + U].toString(16));
    try {
      f = decodeURIComponent(m);
    } catch {
      return i.bin.readASCII(e, t, c);
    }
    return f;
  }, writeUTF8: function(e, t, c) {
    for (var f = c.length, m = 0, U = 0; U < f; U++) {
      var r = c.charCodeAt(U);
      if ((4294967168 & r) == 0) e[t + m] = r, m++;
      else if ((4294965248 & r) == 0) e[t + m] = 192 | r >> 6, e[t + m + 1] = 128 | r >> 0 & 63, m += 2;
      else if ((4294901760 & r) == 0) e[t + m] = 224 | r >> 12, e[t + m + 1] = 128 | r >> 6 & 63, e[t + m + 2] = 128 | r >> 0 & 63, m += 3;
      else {
        if ((4292870144 & r) != 0) throw "e";
        e[t + m] = 240 | r >> 18, e[t + m + 1] = 128 | r >> 12 & 63, e[t + m + 2] = 128 | r >> 6 & 63, e[t + m + 3] = 128 | r >> 0 & 63, m += 4;
      }
    }
    return m;
  }, sizeUTF8: function(e) {
    for (var t = e.length, c = 0, f = 0; f < t; f++) {
      var m = e.charCodeAt(f);
      if ((4294967168 & m) == 0) c++;
      else if ((4294965248 & m) == 0) c += 2;
      else if ((4294901760 & m) == 0) c += 3;
      else {
        if ((4292870144 & m) != 0) throw "e";
        c += 4;
      }
    }
    return c;
  } }, i.F = {}, i.F.deflateRaw = function(e, t, c, f) {
    var m = [[0, 0, 0, 0, 0], [4, 4, 8, 4, 0], [4, 5, 16, 8, 0], [4, 6, 16, 16, 0], [4, 10, 16, 32, 0], [8, 16, 32, 32, 0], [8, 16, 128, 128, 0], [8, 32, 128, 256, 0], [32, 128, 258, 1024, 1], [32, 258, 258, 4096, 1]][f], U = i.F.U, r = i.F._goodIndex;
    i.F._hash;
    var o = i.F._putsE, n = 0, a = c << 3, p = 0, F = e.length;
    if (f == 0) {
      for (; n < F; )
        o(t, a, n + (C = Math.min(65535, F - n)) == F ? 1 : 0), a = i.F._copyExact(e, n, C, t, a + 8), n += C;
      return a >>> 3;
    }
    var T = U.lits, w = U.strt, L = U.prev, H = 0, M = 0, P = 0, v = 0, k = 0, u = 0;
    for (F > 2 && (w[u = i.F._hash(e, 0)] = 0), n = 0; n < F; n++) {
      if (k = u, n + 1 < F - 2) {
        u = i.F._hash(e, n + 1);
        var l = n + 1 & 32767;
        L[l] = w[u], w[u] = l;
      }
      if (p <= n) {
        (H > 14e3 || M > 26697) && F - n > 100 && (p < n && (T[H] = n - p, H += 2, p = n), a = i.F._writeBlock(n == F - 1 || p == F ? 1 : 0, T, H, v, e, P, n - P, t, a), H = M = v = 0, P = n);
        var b = 0;
        n < F - 2 && (b = i.F._bestMatch(e, n, L, k, Math.min(m[2], F - n), m[3]));
        var C = b >>> 16, E = 65535 & b;
        if (b != 0) {
          E = 65535 & b;
          var I = r(C = b >>> 16, U.of0);
          U.lhst[257 + I]++;
          var A = r(E, U.df0);
          U.dhst[A]++, v += U.exb[I] + U.dxb[A], T[H] = C << 23 | n - p, T[H + 1] = E << 16 | I << 8 | A, H += 2, p = n + C;
        } else U.lhst[e[n]]++;
        M++;
      }
    }
    for (P == n && e.length != 0 || (p < n && (T[H] = n - p, H += 2, p = n), a = i.F._writeBlock(1, T, H, v, e, P, n - P, t, a), H = 0, M = 0, H = M = v = 0, P = n); (7 & a) != 0; ) a++;
    return a >>> 3;
  }, i.F._bestMatch = function(e, t, c, f, m, U) {
    var r = 32767 & t, o = c[r], n = r - o + 32768 & 32767;
    if (o == r || f != i.F._hash(e, t - n)) return 0;
    for (var a = 0, p = 0, F = Math.min(32767, t); n <= F && --U != 0 && o != r; ) {
      if (a == 0 || e[t + a] == e[t + a - n]) {
        var T = i.F._howLong(e, t, n);
        if (T > a) {
          if (p = n, (a = T) >= m) break;
          n + 2 < T && (T = n + 2);
          for (var w = 0, L = 0; L < T - 2; L++) {
            var H = t - n + L + 32768 & 32767, M = H - c[H] + 32768 & 32767;
            M > w && (w = M, o = H);
          }
        }
      }
      n += (r = o) - (o = c[r]) + 32768 & 32767;
    }
    return a << 16 | p;
  }, i.F._howLong = function(e, t, c) {
    if (e[t] != e[t - c] || e[t + 1] != e[t + 1 - c] || e[t + 2] != e[t + 2 - c]) return 0;
    var f = t, m = Math.min(e.length, t + 258);
    for (t += 3; t < m && e[t] == e[t - c]; ) t++;
    return t - f;
  }, i.F._hash = function(e, t) {
    return (e[t] << 8 | e[t + 1]) + (e[t + 2] << 4) & 65535;
  }, i.saved = 0, i.F._writeBlock = function(e, t, c, f, m, U, r, o, n) {
    var a, p, F, T, w, L, H, M, P, v = i.F.U, k = i.F._putsF, u = i.F._putsE;
    v.lhst[256]++, p = (a = i.F.getTrees())[0], F = a[1], T = a[2], w = a[3], L = a[4], H = a[5], M = a[6], P = a[7];
    var l = 32 + ((n + 3 & 7) == 0 ? 0 : 8 - (n + 3 & 7)) + (r << 3), b = f + i.F.contSize(v.fltree, v.lhst) + i.F.contSize(v.fdtree, v.dhst), C = f + i.F.contSize(v.ltree, v.lhst) + i.F.contSize(v.dtree, v.dhst);
    C += 14 + 3 * H + i.F.contSize(v.itree, v.ihst) + (2 * v.ihst[16] + 3 * v.ihst[17] + 7 * v.ihst[18]);
    for (var E = 0; E < 286; E++) v.lhst[E] = 0;
    for (E = 0; E < 30; E++) v.dhst[E] = 0;
    for (E = 0; E < 19; E++) v.ihst[E] = 0;
    var I = l < b && l < C ? 0 : b < C ? 1 : 2;
    if (k(o, n, e), k(o, n + 1, I), n += 3, I == 0) {
      for (; (7 & n) != 0; ) n++;
      n = i.F._copyExact(m, U, r, o, n);
    } else {
      var A, S;
      if (I == 1 && (A = v.fltree, S = v.fdtree), I == 2) {
        i.F.makeCodes(v.ltree, p), i.F.revCodes(v.ltree, p), i.F.makeCodes(v.dtree, F), i.F.revCodes(v.dtree, F), i.F.makeCodes(v.itree, T), i.F.revCodes(v.itree, T), A = v.ltree, S = v.dtree, u(o, n, w - 257), u(o, n += 5, L - 1), u(o, n += 5, H - 4), n += 4;
        for (var d = 0; d < H; d++) u(o, n + 3 * d, v.itree[1 + (v.ordr[d] << 1)]);
        n += 3 * H, n = i.F._codeTiny(M, v.itree, o, n), n = i.F._codeTiny(P, v.itree, o, n);
      }
      for (var s = U, D = 0; D < c; D += 2) {
        for (var _ = t[D], x = _ >>> 23, N = s + (8388607 & _); s < N; ) n = i.F._writeLit(m[s++], A, o, n);
        if (x != 0) {
          var B = t[D + 1], Q = B >> 16, O = B >> 8 & 255, R = 255 & B;
          u(o, n = i.F._writeLit(257 + O, A, o, n), x - v.of0[O]), n += v.exb[O], k(o, n = i.F._writeLit(R, S, o, n), Q - v.df0[R]), n += v.dxb[R], s += x;
        }
      }
      n = i.F._writeLit(256, A, o, n);
    }
    return n;
  }, i.F._copyExact = function(e, t, c, f, m) {
    var U = m >>> 3;
    return f[U] = c, f[U + 1] = c >>> 8, f[U + 2] = 255 - f[U], f[U + 3] = 255 - f[U + 1], U += 4, f.set(new Uint8Array(e.buffer, t, c), U), m + (c + 4 << 3);
  }, i.F.getTrees = function() {
    for (var e = i.F.U, t = i.F._hufTree(e.lhst, e.ltree, 15), c = i.F._hufTree(e.dhst, e.dtree, 15), f = [], m = i.F._lenCodes(e.ltree, f), U = [], r = i.F._lenCodes(e.dtree, U), o = 0; o < f.length; o += 2) e.ihst[f[o]]++;
    for (o = 0; o < U.length; o += 2) e.ihst[U[o]]++;
    for (var n = i.F._hufTree(e.ihst, e.itree, 7), a = 19; a > 4 && e.itree[1 + (e.ordr[a - 1] << 1)] == 0; ) a--;
    return [t, c, n, m, r, a, f, U];
  }, i.F.getSecond = function(e) {
    for (var t = [], c = 0; c < e.length; c += 2) t.push(e[c + 1]);
    return t;
  }, i.F.nonZero = function(e) {
    for (var t = "", c = 0; c < e.length; c += 2) e[c + 1] != 0 && (t += (c >> 1) + ",");
    return t;
  }, i.F.contSize = function(e, t) {
    for (var c = 0, f = 0; f < t.length; f++) c += t[f] * e[1 + (f << 1)];
    return c;
  }, i.F._codeTiny = function(e, t, c, f) {
    for (var m = 0; m < e.length; m += 2) {
      var U = e[m], r = e[m + 1];
      f = i.F._writeLit(U, t, c, f);
      var o = U == 16 ? 2 : U == 17 ? 3 : 7;
      U > 15 && (i.F._putsE(c, f, r, o), f += o);
    }
    return f;
  }, i.F._lenCodes = function(e, t) {
    for (var c = e.length; c != 2 && e[c - 1] == 0; ) c -= 2;
    for (var f = 0; f < c; f += 2) {
      var m = e[f + 1], U = f + 3 < c ? e[f + 3] : -1, r = f + 5 < c ? e[f + 5] : -1, o = f == 0 ? -1 : e[f - 1];
      if (m == 0 && U == m && r == m) {
        for (var n = f + 5; n + 2 < c && e[n + 2] == m; ) n += 2;
        (a = Math.min(n + 1 - f >>> 1, 138)) < 11 ? t.push(17, a - 3) : t.push(18, a - 11), f += 2 * a - 2;
      } else if (m == o && U == m && r == m) {
        for (n = f + 5; n + 2 < c && e[n + 2] == m; ) n += 2;
        var a = Math.min(n + 1 - f >>> 1, 6);
        t.push(16, a - 3), f += 2 * a - 2;
      } else t.push(m, 0);
    }
    return c >>> 1;
  }, i.F._hufTree = function(e, t, c) {
    var f = [], m = e.length, U = t.length, r = 0;
    for (r = 0; r < U; r += 2) t[r] = 0, t[r + 1] = 0;
    for (r = 0; r < m; r++) e[r] != 0 && f.push({ lit: r, f: e[r] });
    var o = f.length, n = f.slice(0);
    if (o == 0) return 0;
    if (o == 1) {
      var a = f[0].lit;
      return n = a == 0 ? 1 : 0, t[1 + (a << 1)] = 1, t[1 + (n << 1)] = 1, 1;
    }
    f.sort((function(M, P) {
      return M.f - P.f;
    }));
    var p = f[0], F = f[1], T = 0, w = 1, L = 2;
    for (f[0] = { lit: -1, f: p.f + F.f, l: p, r: F, d: 0 }; w != o - 1; ) p = T != w && (L == o || f[T].f < f[L].f) ? f[T++] : f[L++], F = T != w && (L == o || f[T].f < f[L].f) ? f[T++] : f[L++], f[w++] = { lit: -1, f: p.f + F.f, l: p, r: F };
    var H = i.F.setDepth(f[w - 1], 0);
    for (H > c && (i.F.restrictDepth(n, c, H), H = c), r = 0; r < o; r++) t[1 + (n[r].lit << 1)] = n[r].d;
    return H;
  }, i.F.setDepth = function(e, t) {
    return e.lit != -1 ? (e.d = t, t) : Math.max(i.F.setDepth(e.l, t + 1), i.F.setDepth(e.r, t + 1));
  }, i.F.restrictDepth = function(e, t, c) {
    var f = 0, m = 1 << c - t, U = 0;
    for (e.sort((function(o, n) {
      return n.d == o.d ? o.f - n.f : n.d - o.d;
    })), f = 0; f < e.length && e[f].d > t; f++) {
      var r = e[f].d;
      e[f].d = t, U += m - (1 << c - r);
    }
    for (U >>>= c - t; U > 0; )
      (r = e[f].d) < t ? (e[f].d++, U -= 1 << t - r - 1) : f++;
    for (; f >= 0; f--) e[f].d == t && U < 0 && (e[f].d--, U++);
    U != 0 && console.log("debt left");
  }, i.F._goodIndex = function(e, t) {
    var c = 0;
    return t[16 | c] <= e && (c |= 16), t[8 | c] <= e && (c |= 8), t[4 | c] <= e && (c |= 4), t[2 | c] <= e && (c |= 2), t[1 | c] <= e && (c |= 1), c;
  }, i.F._writeLit = function(e, t, c, f) {
    return i.F._putsF(c, f, t[e << 1]), f + t[1 + (e << 1)];
  }, i.F.inflate = function(e, t) {
    var c = Uint8Array;
    if (e[0] == 3 && e[1] == 0) return t || new c(0);
    var f = i.F, m = f._bitsF, U = f._bitsE, r = f._decodeTiny, o = f.makeCodes, n = f.codes2map, a = f._get17, p = f.U, F = t == null;
    F && (t = new c(e.length >>> 2 << 3));
    for (var T, w, L = 0, H = 0, M = 0, P = 0, v = 0, k = 0, u = 0, l = 0, b = 0; L == 0; ) if (L = m(e, b, 1), H = m(e, b + 1, 2), b += 3, H != 0) {
      if (F && (t = i.F._check(t, l + (1 << 17))), H == 1 && (T = p.flmap, w = p.fdmap, k = 511, u = 31), H == 2) {
        M = U(e, b, 5) + 257, P = U(e, b + 5, 5) + 1, v = U(e, b + 10, 4) + 4, b += 14;
        for (var C = 0; C < 38; C += 2) p.itree[C] = 0, p.itree[C + 1] = 0;
        var E = 1;
        for (C = 0; C < v; C++) {
          var I = U(e, b + 3 * C, 3);
          p.itree[1 + (p.ordr[C] << 1)] = I, I > E && (E = I);
        }
        b += 3 * v, o(p.itree, E), n(p.itree, E, p.imap), T = p.lmap, w = p.dmap, b = r(p.imap, (1 << E) - 1, M + P, e, b, p.ttree);
        var A = f._copyOut(p.ttree, 0, M, p.ltree);
        k = (1 << A) - 1;
        var S = f._copyOut(p.ttree, M, P, p.dtree);
        u = (1 << S) - 1, o(p.ltree, A), n(p.ltree, A, T), o(p.dtree, S), n(p.dtree, S, w);
      }
      for (; ; ) {
        var d = T[a(e, b) & k];
        b += 15 & d;
        var s = d >>> 4;
        if (!(s >>> 8)) t[l++] = s;
        else {
          if (s == 256) break;
          var D = l + s - 254;
          if (s > 264) {
            var _ = p.ldef[s - 257];
            D = l + (_ >>> 3) + U(e, b, 7 & _), b += 7 & _;
          }
          var x = w[a(e, b) & u];
          b += 15 & x;
          var N = x >>> 4, B = p.ddef[N], Q = (B >>> 4) + m(e, b, 15 & B);
          for (b += 15 & B, F && (t = i.F._check(t, l + (1 << 17))); l < D; ) t[l] = t[l++ - Q], t[l] = t[l++ - Q], t[l] = t[l++ - Q], t[l] = t[l++ - Q];
          l = D;
        }
      }
    } else {
      (7 & b) != 0 && (b += 8 - (7 & b));
      var O = 4 + (b >>> 3), R = e[O - 4] | e[O - 3] << 8;
      F && (t = i.F._check(t, l + R)), t.set(new c(e.buffer, e.byteOffset + O, R), l), b = O + R << 3, l += R;
    }
    return t.length == l ? t : t.slice(0, l);
  }, i.F._check = function(e, t) {
    var c = e.length;
    if (t <= c) return e;
    var f = new Uint8Array(Math.max(c << 1, t));
    return f.set(e, 0), f;
  }, i.F._decodeTiny = function(e, t, c, f, m, U) {
    for (var r = i.F._bitsE, o = i.F._get17, n = 0; n < c; ) {
      var a = e[o(f, m) & t];
      m += 15 & a;
      var p = a >>> 4;
      if (p <= 15) U[n] = p, n++;
      else {
        var F = 0, T = 0;
        p == 16 ? (T = 3 + r(f, m, 2), m += 2, F = U[n - 1]) : p == 17 ? (T = 3 + r(f, m, 3), m += 3) : p == 18 && (T = 11 + r(f, m, 7), m += 7);
        for (var w = n + T; n < w; ) U[n] = F, n++;
      }
    }
    return m;
  }, i.F._copyOut = function(e, t, c, f) {
    for (var m = 0, U = 0, r = f.length >>> 1; U < c; ) {
      var o = e[U + t];
      f[U << 1] = 0, f[1 + (U << 1)] = o, o > m && (m = o), U++;
    }
    for (; U < r; ) f[U << 1] = 0, f[1 + (U << 1)] = 0, U++;
    return m;
  }, i.F.makeCodes = function(e, t) {
    for (var c, f, m, U, r = i.F.U, o = e.length, n = r.bl_count, a = 0; a <= t; a++) n[a] = 0;
    for (a = 1; a < o; a += 2) n[e[a]]++;
    var p = r.next_code;
    for (c = 0, n[0] = 0, f = 1; f <= t; f++) c = c + n[f - 1] << 1, p[f] = c;
    for (m = 0; m < o; m += 2) (U = e[m + 1]) != 0 && (e[m] = p[U], p[U]++);
  }, i.F.codes2map = function(e, t, c) {
    for (var f = e.length, m = i.F.U.rev15, U = 0; U < f; U += 2) if (e[U + 1] != 0) for (var r = U >> 1, o = e[U + 1], n = r << 4 | o, a = t - o, p = e[U] << a, F = p + (1 << a); p != F; )
      c[m[p] >>> 15 - t] = n, p++;
  }, i.F.revCodes = function(e, t) {
    for (var c = i.F.U.rev15, f = 15 - t, m = 0; m < e.length; m += 2) {
      var U = e[m] << t - e[m + 1];
      e[m] = c[U] >>> f;
    }
  }, i.F._putsE = function(e, t, c) {
    c <<= 7 & t;
    var f = t >>> 3;
    e[f] |= c, e[f + 1] |= c >>> 8;
  }, i.F._putsF = function(e, t, c) {
    c <<= 7 & t;
    var f = t >>> 3;
    e[f] |= c, e[f + 1] |= c >>> 8, e[f + 2] |= c >>> 16;
  }, i.F._bitsE = function(e, t, c) {
    return (e[t >>> 3] | e[1 + (t >>> 3)] << 8) >>> (7 & t) & (1 << c) - 1;
  }, i.F._bitsF = function(e, t, c) {
    return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16) >>> (7 & t) & (1 << c) - 1;
  }, i.F._get17 = function(e, t) {
    return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16) >>> (7 & t);
  }, i.F._get25 = function(e, t) {
    return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16 | e[3 + (t >>> 3)] << 24) >>> (7 & t);
  }, i.F.U = (g = Uint16Array, y = Uint32Array, { next_code: new g(16), bl_count: new g(16), ordr: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], of0: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999], exb: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0], ldef: new g(32), df0: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535], dxb: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0], ddef: new y(32), flmap: new g(512), fltree: [], fdmap: new g(32), fdtree: [], lmap: new g(32768), ltree: [], ttree: [], dmap: new g(32768), dtree: [], imap: new g(512), itree: [], rev15: new g(32768), lhst: new y(286), dhst: new y(30), ihst: new y(19), lits: new y(15e3), strt: new g(65536), prev: new g(32768) }), (function() {
    for (var e = i.F.U, t = 0; t < 32768; t++) {
      var c = t;
      c = (4278255360 & (c = (4042322160 & (c = (3435973836 & (c = (2863311530 & c) >>> 1 | (1431655765 & c) << 1)) >>> 2 | (858993459 & c) << 2)) >>> 4 | (252645135 & c) << 4)) >>> 8 | (16711935 & c) << 8, e.rev15[t] = (c >>> 16 | c << 16) >>> 17;
    }
    function f(m, U, r) {
      for (; U-- != 0; ) m.push(0, r);
    }
    for (t = 0; t < 32; t++) e.ldef[t] = e.of0[t] << 3 | e.exb[t], e.ddef[t] = e.df0[t] << 4 | e.dxb[t];
    f(e.fltree, 144, 8), f(e.fltree, 112, 9), f(e.fltree, 24, 7), f(e.fltree, 8, 8), i.F.makeCodes(e.fltree, 9), i.F.codes2map(e.fltree, 9, e.flmap), i.F.revCodes(e.fltree, 9), f(e.fdtree, 32, 5), i.F.makeCodes(e.fdtree, 5), i.F.codes2map(e.fdtree, 5, e.fdmap), i.F.revCodes(e.fdtree, 5), f(e.itree, 19, 0), f(e.ltree, 286, 0), f(e.dtree, 30, 0), f(e.ttree, 320, 0);
  })();
})();
var Gt = Wt({ __proto__: null, default: We }, [We]);
const ge = (function() {
  var h = { nextZero(r, o) {
    for (; r[o] != 0; ) o++;
    return o;
  }, readUshort: (r, o) => r[o] << 8 | r[o + 1], writeUshort(r, o, n) {
    r[o] = n >> 8 & 255, r[o + 1] = 255 & n;
  }, readUint: (r, o) => 16777216 * r[o] + (r[o + 1] << 16 | r[o + 2] << 8 | r[o + 3]), writeUint(r, o, n) {
    r[o] = n >> 24 & 255, r[o + 1] = n >> 16 & 255, r[o + 2] = n >> 8 & 255, r[o + 3] = 255 & n;
  }, readASCII(r, o, n) {
    let a = "";
    for (let p = 0; p < n; p++) a += String.fromCharCode(r[o + p]);
    return a;
  }, writeASCII(r, o, n) {
    for (let a = 0; a < n.length; a++) r[o + a] = n.charCodeAt(a);
  }, readBytes(r, o, n) {
    const a = [];
    for (let p = 0; p < n; p++) a.push(r[o + p]);
    return a;
  }, pad: (r) => r.length < 2 ? `0${r}` : r, readUTF8(r, o, n) {
    let a, p = "";
    for (let F = 0; F < n; F++) p += `%${h.pad(r[o + F].toString(16))}`;
    try {
      a = decodeURIComponent(p);
    } catch {
      return h.readASCII(r, o, n);
    }
    return a;
  } };
  function g(r, o, n, a) {
    const p = o * n, F = t(a), T = Math.ceil(o * F / 8), w = new Uint8Array(4 * p), L = new Uint32Array(w.buffer), { ctype: H } = a, { depth: M } = a, P = h.readUshort;
    if (H == 6) {
      const _ = p << 2;
      if (M == 8) for (var v = 0; v < _; v += 4) w[v] = r[v], w[v + 1] = r[v + 1], w[v + 2] = r[v + 2], w[v + 3] = r[v + 3];
      if (M == 16) for (v = 0; v < _; v++) w[v] = r[v << 1];
    } else if (H == 2) {
      const _ = a.tabs.tRNS;
      if (_ == null) {
        if (M == 8) for (v = 0; v < p; v++) {
          var k = 3 * v;
          L[v] = 255 << 24 | r[k + 2] << 16 | r[k + 1] << 8 | r[k];
        }
        if (M == 16) for (v = 0; v < p; v++)
          k = 6 * v, L[v] = 255 << 24 | r[k + 4] << 16 | r[k + 2] << 8 | r[k];
      } else {
        var u = _[0];
        const x = _[1], N = _[2];
        if (M == 8) for (v = 0; v < p; v++) {
          var l = v << 2;
          k = 3 * v, L[v] = 255 << 24 | r[k + 2] << 16 | r[k + 1] << 8 | r[k], r[k] == u && r[k + 1] == x && r[k + 2] == N && (w[l + 3] = 0);
        }
        if (M == 16) for (v = 0; v < p; v++)
          l = v << 2, k = 6 * v, L[v] = 255 << 24 | r[k + 4] << 16 | r[k + 2] << 8 | r[k], P(r, k) == u && P(r, k + 2) == x && P(r, k + 4) == N && (w[l + 3] = 0);
      }
    } else if (H == 3) {
      const _ = a.tabs.PLTE, x = a.tabs.tRNS, N = x ? x.length : 0;
      if (M == 1) for (var b = 0; b < n; b++) {
        var C = b * T, E = b * o;
        for (v = 0; v < o; v++) {
          l = E + v << 2;
          var I = 3 * (A = r[C + (v >> 3)] >> 7 - ((7 & v) << 0) & 1);
          w[l] = _[I], w[l + 1] = _[I + 1], w[l + 2] = _[I + 2], w[l + 3] = A < N ? x[A] : 255;
        }
      }
      if (M == 2) for (b = 0; b < n; b++) for (C = b * T, E = b * o, v = 0; v < o; v++)
        l = E + v << 2, I = 3 * (A = r[C + (v >> 2)] >> 6 - ((3 & v) << 1) & 3), w[l] = _[I], w[l + 1] = _[I + 1], w[l + 2] = _[I + 2], w[l + 3] = A < N ? x[A] : 255;
      if (M == 4) for (b = 0; b < n; b++) for (C = b * T, E = b * o, v = 0; v < o; v++)
        l = E + v << 2, I = 3 * (A = r[C + (v >> 1)] >> 4 - ((1 & v) << 2) & 15), w[l] = _[I], w[l + 1] = _[I + 1], w[l + 2] = _[I + 2], w[l + 3] = A < N ? x[A] : 255;
      if (M == 8) for (v = 0; v < p; v++) {
        var A;
        l = v << 2, I = 3 * (A = r[v]), w[l] = _[I], w[l + 1] = _[I + 1], w[l + 2] = _[I + 2], w[l + 3] = A < N ? x[A] : 255;
      }
    } else if (H == 4) {
      if (M == 8) for (v = 0; v < p; v++) {
        l = v << 2;
        var S = r[d = v << 1];
        w[l] = S, w[l + 1] = S, w[l + 2] = S, w[l + 3] = r[d + 1];
      }
      if (M == 16) for (v = 0; v < p; v++) {
        var d;
        l = v << 2, S = r[d = v << 2], w[l] = S, w[l + 1] = S, w[l + 2] = S, w[l + 3] = r[d + 2];
      }
    } else if (H == 0) for (u = a.tabs.tRNS ? a.tabs.tRNS : -1, b = 0; b < n; b++) {
      const _ = b * T, x = b * o;
      if (M == 1) for (var s = 0; s < o; s++) {
        var D = (S = 255 * (r[_ + (s >>> 3)] >>> 7 - (7 & s) & 1)) == 255 * u ? 0 : 255;
        L[x + s] = D << 24 | S << 16 | S << 8 | S;
      }
      else if (M == 2) for (s = 0; s < o; s++)
        D = (S = 85 * (r[_ + (s >>> 2)] >>> 6 - ((3 & s) << 1) & 3)) == 85 * u ? 0 : 255, L[x + s] = D << 24 | S << 16 | S << 8 | S;
      else if (M == 4) for (s = 0; s < o; s++)
        D = (S = 17 * (r[_ + (s >>> 1)] >>> 4 - ((1 & s) << 2) & 15)) == 17 * u ? 0 : 255, L[x + s] = D << 24 | S << 16 | S << 8 | S;
      else if (M == 8) for (s = 0; s < o; s++)
        D = (S = r[_ + s]) == u ? 0 : 255, L[x + s] = D << 24 | S << 16 | S << 8 | S;
      else if (M == 16) for (s = 0; s < o; s++)
        S = r[_ + (s << 1)], D = P(r, _ + (s << 1)) == u ? 0 : 255, L[x + s] = D << 24 | S << 16 | S << 8 | S;
    }
    return w;
  }
  function y(r, o, n, a) {
    const p = t(r), F = Math.ceil(n * p / 8), T = new Uint8Array((F + 1 + r.interlace) * a);
    return o = r.tabs.CgBI ? e(o, T) : i(o, T), r.interlace == 0 ? o = c(o, r, 0, n, a) : r.interlace == 1 && (o = (function(L, H) {
      const M = H.width, P = H.height, v = t(H), k = v >> 3, u = Math.ceil(M * v / 8), l = new Uint8Array(P * u);
      let b = 0;
      const C = [0, 0, 4, 0, 2, 0, 1], E = [0, 4, 0, 2, 0, 1, 0], I = [8, 8, 8, 4, 4, 2, 2], A = [8, 8, 4, 4, 2, 2, 1];
      let S = 0;
      for (; S < 7; ) {
        const s = I[S], D = A[S];
        let _ = 0, x = 0, N = C[S];
        for (; N < P; ) N += s, x++;
        let B = E[S];
        for (; B < M; ) B += D, _++;
        const Q = Math.ceil(_ * v / 8);
        c(L, H, b, _, x);
        let O = 0, R = C[S];
        for (; R < P; ) {
          let z = E[S], Z = b + O * Q << 3;
          for (; z < M; ) {
            var d;
            if (v == 1 && (d = (d = L[Z >> 3]) >> 7 - (7 & Z) & 1, l[R * u + (z >> 3)] |= d << 7 - ((7 & z) << 0)), v == 2 && (d = (d = L[Z >> 3]) >> 6 - (7 & Z) & 3, l[R * u + (z >> 2)] |= d << 6 - ((3 & z) << 1)), v == 4 && (d = (d = L[Z >> 3]) >> 4 - (7 & Z) & 15, l[R * u + (z >> 1)] |= d << 4 - ((1 & z) << 2)), v >= 8) {
              const q = R * u + z * k;
              for (let W = 0; W < k; W++) l[q + W] = L[(Z >> 3) + W];
            }
            Z += v, z += D;
          }
          O++, R += s;
        }
        _ * x != 0 && (b += x * (1 + Q)), S += 1;
      }
      return l;
    })(o, r)), o;
  }
  function i(r, o) {
    return e(new Uint8Array(r.buffer, 2, r.length - 6), o);
  }
  var e = (function() {
    const r = { H: {} };
    return r.H.N = function(o, n) {
      const a = Uint8Array;
      let p, F, T = 0, w = 0, L = 0, H = 0, M = 0, P = 0, v = 0, k = 0, u = 0;
      if (o[0] == 3 && o[1] == 0) return n || new a(0);
      const l = r.H, b = l.b, C = l.e, E = l.R, I = l.n, A = l.A, S = l.Z, d = l.m, s = n == null;
      for (s && (n = new a(o.length >>> 2 << 5)); T == 0; ) if (T = b(o, u, 1), w = b(o, u + 1, 2), u += 3, w != 0) {
        if (s && (n = r.H.W(n, k + (1 << 17))), w == 1 && (p = d.J, F = d.h, P = 511, v = 31), w == 2) {
          L = C(o, u, 5) + 257, H = C(o, u + 5, 5) + 1, M = C(o, u + 10, 4) + 4, u += 14;
          let _ = 1;
          for (var D = 0; D < 38; D += 2) d.Q[D] = 0, d.Q[D + 1] = 0;
          for (D = 0; D < M; D++) {
            const B = C(o, u + 3 * D, 3);
            d.Q[1 + (d.X[D] << 1)] = B, B > _ && (_ = B);
          }
          u += 3 * M, I(d.Q, _), A(d.Q, _, d.u), p = d.w, F = d.d, u = E(d.u, (1 << _) - 1, L + H, o, u, d.v);
          const x = l.V(d.v, 0, L, d.C);
          P = (1 << x) - 1;
          const N = l.V(d.v, L, H, d.D);
          v = (1 << N) - 1, I(d.C, x), A(d.C, x, p), I(d.D, N), A(d.D, N, F);
        }
        for (; ; ) {
          const _ = p[S(o, u) & P];
          u += 15 & _;
          const x = _ >>> 4;
          if (!(x >>> 8)) n[k++] = x;
          else {
            if (x == 256) break;
            {
              let N = k + x - 254;
              if (x > 264) {
                const z = d.q[x - 257];
                N = k + (z >>> 3) + C(o, u, 7 & z), u += 7 & z;
              }
              const B = F[S(o, u) & v];
              u += 15 & B;
              const Q = B >>> 4, O = d.c[Q], R = (O >>> 4) + b(o, u, 15 & O);
              for (u += 15 & O; k < N; ) n[k] = n[k++ - R], n[k] = n[k++ - R], n[k] = n[k++ - R], n[k] = n[k++ - R];
              k = N;
            }
          }
        }
      } else {
        (7 & u) != 0 && (u += 8 - (7 & u));
        const _ = 4 + (u >>> 3), x = o[_ - 4] | o[_ - 3] << 8;
        s && (n = r.H.W(n, k + x)), n.set(new a(o.buffer, o.byteOffset + _, x), k), u = _ + x << 3, k += x;
      }
      return n.length == k ? n : n.slice(0, k);
    }, r.H.W = function(o, n) {
      const a = o.length;
      if (n <= a) return o;
      const p = new Uint8Array(a << 1);
      return p.set(o, 0), p;
    }, r.H.R = function(o, n, a, p, F, T) {
      const w = r.H.e, L = r.H.Z;
      let H = 0;
      for (; H < a; ) {
        const M = o[L(p, F) & n];
        F += 15 & M;
        const P = M >>> 4;
        if (P <= 15) T[H] = P, H++;
        else {
          let v = 0, k = 0;
          P == 16 ? (k = 3 + w(p, F, 2), F += 2, v = T[H - 1]) : P == 17 ? (k = 3 + w(p, F, 3), F += 3) : P == 18 && (k = 11 + w(p, F, 7), F += 7);
          const u = H + k;
          for (; H < u; ) T[H] = v, H++;
        }
      }
      return F;
    }, r.H.V = function(o, n, a, p) {
      let F = 0, T = 0;
      const w = p.length >>> 1;
      for (; T < a; ) {
        const L = o[T + n];
        p[T << 1] = 0, p[1 + (T << 1)] = L, L > F && (F = L), T++;
      }
      for (; T < w; ) p[T << 1] = 0, p[1 + (T << 1)] = 0, T++;
      return F;
    }, r.H.n = function(o, n) {
      const a = r.H.m, p = o.length;
      let F, T, w, L;
      const H = a.j;
      for (var M = 0; M <= n; M++) H[M] = 0;
      for (M = 1; M < p; M += 2) H[o[M]]++;
      const P = a.K;
      for (F = 0, H[0] = 0, T = 1; T <= n; T++) F = F + H[T - 1] << 1, P[T] = F;
      for (w = 0; w < p; w += 2) L = o[w + 1], L != 0 && (o[w] = P[L], P[L]++);
    }, r.H.A = function(o, n, a) {
      const p = o.length, F = r.H.m.r;
      for (let T = 0; T < p; T += 2) if (o[T + 1] != 0) {
        const w = T >> 1, L = o[T + 1], H = w << 4 | L, M = n - L;
        let P = o[T] << M;
        const v = P + (1 << M);
        for (; P != v; )
          a[F[P] >>> 15 - n] = H, P++;
      }
    }, r.H.l = function(o, n) {
      const a = r.H.m.r, p = 15 - n;
      for (let F = 0; F < o.length; F += 2) {
        const T = o[F] << n - o[F + 1];
        o[F] = a[T] >>> p;
      }
    }, r.H.M = function(o, n, a) {
      a <<= 7 & n;
      const p = n >>> 3;
      o[p] |= a, o[p + 1] |= a >>> 8;
    }, r.H.I = function(o, n, a) {
      a <<= 7 & n;
      const p = n >>> 3;
      o[p] |= a, o[p + 1] |= a >>> 8, o[p + 2] |= a >>> 16;
    }, r.H.e = function(o, n, a) {
      return (o[n >>> 3] | o[1 + (n >>> 3)] << 8) >>> (7 & n) & (1 << a) - 1;
    }, r.H.b = function(o, n, a) {
      return (o[n >>> 3] | o[1 + (n >>> 3)] << 8 | o[2 + (n >>> 3)] << 16) >>> (7 & n) & (1 << a) - 1;
    }, r.H.Z = function(o, n) {
      return (o[n >>> 3] | o[1 + (n >>> 3)] << 8 | o[2 + (n >>> 3)] << 16) >>> (7 & n);
    }, r.H.i = function(o, n) {
      return (o[n >>> 3] | o[1 + (n >>> 3)] << 8 | o[2 + (n >>> 3)] << 16 | o[3 + (n >>> 3)] << 24) >>> (7 & n);
    }, r.H.m = (function() {
      const o = Uint16Array, n = Uint32Array;
      return { K: new o(16), j: new o(16), X: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], S: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999], T: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0], q: new o(32), p: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535], z: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0], c: new n(32), J: new o(512), _: [], h: new o(32), $: [], w: new o(32768), C: [], v: [], d: new o(32768), D: [], u: new o(512), Q: [], r: new o(32768), s: new n(286), Y: new n(30), a: new n(19), t: new n(15e3), k: new o(65536), g: new o(32768) };
    })(), (function() {
      const o = r.H.m;
      for (var n = 0; n < 32768; n++) {
        let p = n;
        p = (2863311530 & p) >>> 1 | (1431655765 & p) << 1, p = (3435973836 & p) >>> 2 | (858993459 & p) << 2, p = (4042322160 & p) >>> 4 | (252645135 & p) << 4, p = (4278255360 & p) >>> 8 | (16711935 & p) << 8, o.r[n] = (p >>> 16 | p << 16) >>> 17;
      }
      function a(p, F, T) {
        for (; F-- != 0; ) p.push(0, T);
      }
      for (n = 0; n < 32; n++) o.q[n] = o.S[n] << 3 | o.T[n], o.c[n] = o.p[n] << 4 | o.z[n];
      a(o._, 144, 8), a(o._, 112, 9), a(o._, 24, 7), a(o._, 8, 8), r.H.n(o._, 9), r.H.A(o._, 9, o.J), r.H.l(o._, 9), a(o.$, 32, 5), r.H.n(o.$, 5), r.H.A(o.$, 5, o.h), r.H.l(o.$, 5), a(o.Q, 19, 0), a(o.C, 286, 0), a(o.D, 30, 0), a(o.v, 320, 0);
    })(), r.H.N;
  })();
  function t(r) {
    return [1, null, 3, 1, 2, null, 4][r.ctype] * r.depth;
  }
  function c(r, o, n, a, p) {
    let F = t(o);
    const T = Math.ceil(a * F / 8);
    let w, L;
    F = Math.ceil(F / 8);
    let H = r[n], M = 0;
    if (H > 1 && (r[n] = [0, 0, 1][H - 2]), H == 3) for (M = F; M < T; M++) r[M + 1] = r[M + 1] + (r[M + 1 - F] >>> 1) & 255;
    for (let P = 0; P < p; P++) if (w = n + P * T, L = w + P + 1, H = r[L - 1], M = 0, H == 0) for (; M < T; M++) r[w + M] = r[L + M];
    else if (H == 1) {
      for (; M < F; M++) r[w + M] = r[L + M];
      for (; M < T; M++) r[w + M] = r[L + M] + r[w + M - F];
    } else if (H == 2) for (; M < T; M++) r[w + M] = r[L + M] + r[w + M - T];
    else if (H == 3) {
      for (; M < F; M++) r[w + M] = r[L + M] + (r[w + M - T] >>> 1);
      for (; M < T; M++) r[w + M] = r[L + M] + (r[w + M - T] + r[w + M - F] >>> 1);
    } else {
      for (; M < F; M++) r[w + M] = r[L + M] + f(0, r[w + M - T], 0);
      for (; M < T; M++) r[w + M] = r[L + M] + f(r[w + M - F], r[w + M - T], r[w + M - F - T]);
    }
    return r;
  }
  function f(r, o, n) {
    const a = r + o - n, p = a - r, F = a - o, T = a - n;
    return p * p <= F * F && p * p <= T * T ? r : F * F <= T * T ? o : n;
  }
  function m(r, o, n) {
    n.width = h.readUint(r, o), o += 4, n.height = h.readUint(r, o), o += 4, n.depth = r[o], o++, n.ctype = r[o], o++, n.compress = r[o], o++, n.filter = r[o], o++, n.interlace = r[o], o++;
  }
  function U(r, o, n, a, p, F, T, w, L) {
    const H = Math.min(o, p), M = Math.min(n, F);
    let P = 0, v = 0;
    for (let S = 0; S < M; S++) for (let d = 0; d < H; d++) if (T >= 0 && w >= 0 ? (P = S * o + d << 2, v = (w + S) * p + T + d << 2) : (P = (-w + S) * o - T + d << 2, v = S * p + d << 2), L == 0) a[v] = r[P], a[v + 1] = r[P + 1], a[v + 2] = r[P + 2], a[v + 3] = r[P + 3];
    else if (L == 1) {
      var k = r[P + 3] * 0.00392156862745098, u = r[P] * k, l = r[P + 1] * k, b = r[P + 2] * k, C = a[v + 3] * (1 / 255), E = a[v] * C, I = a[v + 1] * C, A = a[v + 2] * C;
      const s = 1 - k, D = k + C * s, _ = D == 0 ? 0 : 1 / D;
      a[v + 3] = 255 * D, a[v + 0] = (u + E * s) * _, a[v + 1] = (l + I * s) * _, a[v + 2] = (b + A * s) * _;
    } else if (L == 2)
      k = r[P + 3], u = r[P], l = r[P + 1], b = r[P + 2], C = a[v + 3], E = a[v], I = a[v + 1], A = a[v + 2], k == C && u == E && l == I && b == A ? (a[v] = 0, a[v + 1] = 0, a[v + 2] = 0, a[v + 3] = 0) : (a[v] = u, a[v + 1] = l, a[v + 2] = b, a[v + 3] = k);
    else if (L == 3) {
      if (k = r[P + 3], u = r[P], l = r[P + 1], b = r[P + 2], C = a[v + 3], E = a[v], I = a[v + 1], A = a[v + 2], k == C && u == E && l == I && b == A) continue;
      if (k < 220 && C > 20) return !1;
    }
    return !0;
  }
  return { decode: function(o) {
    const n = new Uint8Array(o);
    let a = 8;
    const p = h, F = p.readUshort, T = p.readUint, w = { tabs: {}, frames: [] }, L = new Uint8Array(n.length);
    let H, M = 0, P = 0;
    const v = [137, 80, 78, 71, 13, 10, 26, 10];
    for (var k = 0; k < 8; k++) if (n[k] != v[k]) throw "The input is not a PNG file!";
    for (; a < n.length; ) {
      const S = p.readUint(n, a);
      a += 4;
      const d = p.readASCII(n, a, 4);
      if (a += 4, d == "IHDR") m(n, a, w);
      else if (d == "iCCP") {
        for (var u = a; n[u] != 0; ) u++;
        p.readASCII(n, a, u - a), n[u + 1];
        const s = n.slice(u + 2, a + S);
        let D = null;
        try {
          D = i(s);
        } catch {
          D = e(s);
        }
        w.tabs[d] = D;
      } else if (d == "CgBI") w.tabs[d] = n.slice(a, a + 4);
      else if (d == "IDAT") {
        for (k = 0; k < S; k++) L[M + k] = n[a + k];
        M += S;
      } else if (d == "acTL") w.tabs[d] = { num_frames: T(n, a), num_plays: T(n, a + 4) }, H = new Uint8Array(n.length);
      else if (d == "fcTL") {
        P != 0 && ((A = w.frames[w.frames.length - 1]).data = y(w, H.slice(0, P), A.rect.width, A.rect.height), P = 0);
        const s = { x: T(n, a + 12), y: T(n, a + 16), width: T(n, a + 4), height: T(n, a + 8) };
        let D = F(n, a + 22);
        D = F(n, a + 20) / (D == 0 ? 100 : D);
        const _ = { rect: s, delay: Math.round(1e3 * D), dispose: n[a + 24], blend: n[a + 25] };
        w.frames.push(_);
      } else if (d == "fdAT") {
        for (k = 0; k < S - 4; k++) H[P + k] = n[a + k + 4];
        P += S - 4;
      } else if (d == "pHYs") w.tabs[d] = [p.readUint(n, a), p.readUint(n, a + 4), n[a + 8]];
      else if (d == "cHRM")
        for (w.tabs[d] = [], k = 0; k < 8; k++) w.tabs[d].push(p.readUint(n, a + 4 * k));
      else if (d == "tEXt" || d == "zTXt") {
        w.tabs[d] == null && (w.tabs[d] = {});
        var l = p.nextZero(n, a), b = p.readASCII(n, a, l - a), C = a + S - l - 1;
        if (d == "tEXt") I = p.readASCII(n, l + 1, C);
        else {
          var E = i(n.slice(l + 2, l + 2 + C));
          I = p.readUTF8(E, 0, E.length);
        }
        w.tabs[d][b] = I;
      } else if (d == "iTXt") {
        w.tabs[d] == null && (w.tabs[d] = {}), l = 0, u = a, l = p.nextZero(n, u), b = p.readASCII(n, u, l - u);
        const s = n[u = l + 1];
        var I;
        n[u + 1], u += 2, l = p.nextZero(n, u), p.readASCII(n, u, l - u), u = l + 1, l = p.nextZero(n, u), p.readUTF8(n, u, l - u), C = S - ((u = l + 1) - a), s == 0 ? I = p.readUTF8(n, u, C) : (E = i(n.slice(u, u + C)), I = p.readUTF8(E, 0, E.length)), w.tabs[d][b] = I;
      } else if (d == "PLTE") w.tabs[d] = p.readBytes(n, a, S);
      else if (d == "hIST") {
        const s = w.tabs.PLTE.length / 3;
        for (w.tabs[d] = [], k = 0; k < s; k++) w.tabs[d].push(F(n, a + 2 * k));
      } else if (d == "tRNS") w.ctype == 3 ? w.tabs[d] = p.readBytes(n, a, S) : w.ctype == 0 ? w.tabs[d] = F(n, a) : w.ctype == 2 && (w.tabs[d] = [F(n, a), F(n, a + 2), F(n, a + 4)]);
      else if (d == "gAMA") w.tabs[d] = p.readUint(n, a) / 1e5;
      else if (d == "sRGB") w.tabs[d] = n[a];
      else if (d == "bKGD") w.ctype == 0 || w.ctype == 4 ? w.tabs[d] = [F(n, a)] : w.ctype == 2 || w.ctype == 6 ? w.tabs[d] = [F(n, a), F(n, a + 2), F(n, a + 4)] : w.ctype == 3 && (w.tabs[d] = n[a]);
      else if (d == "IEND") break;
      a += S, p.readUint(n, a), a += 4;
    }
    var A;
    return P != 0 && ((A = w.frames[w.frames.length - 1]).data = y(w, H.slice(0, P), A.rect.width, A.rect.height)), w.data = y(w, L, w.width, w.height), delete w.compress, delete w.interlace, delete w.filter, w;
  }, toRGBA8: function(o) {
    const n = o.width, a = o.height;
    if (o.tabs.acTL == null) return [g(o.data, n, a, o).buffer];
    const p = [];
    o.frames[0].data == null && (o.frames[0].data = o.data);
    const F = n * a * 4, T = new Uint8Array(F), w = new Uint8Array(F), L = new Uint8Array(F);
    for (let M = 0; M < o.frames.length; M++) {
      const P = o.frames[M], v = P.rect.x, k = P.rect.y, u = P.rect.width, l = P.rect.height, b = g(P.data, u, l, o);
      if (M != 0) for (var H = 0; H < F; H++) L[H] = T[H];
      if (P.blend == 0 ? U(b, u, l, T, n, a, v, k, 0) : P.blend == 1 && U(b, u, l, T, n, a, v, k, 1), p.push(T.buffer.slice(0)), P.dispose != 0) {
        if (P.dispose == 1) U(w, u, l, T, n, a, v, k, 0);
        else if (P.dispose == 2) for (H = 0; H < F; H++) T[H] = L[H];
      }
    }
    return p;
  }, _paeth: f, _copyTile: U, _bin: h };
})();
(function() {
  const { _copyTile: h } = ge, { _bin: g } = ge, y = ge._paeth;
  var i = { table: (function() {
    const u = new Uint32Array(256);
    for (let l = 0; l < 256; l++) {
      let b = l;
      for (let C = 0; C < 8; C++) 1 & b ? b = 3988292384 ^ b >>> 1 : b >>>= 1;
      u[l] = b;
    }
    return u;
  })(), update(u, l, b, C) {
    for (let E = 0; E < C; E++) u = i.table[255 & (u ^ l[b + E])] ^ u >>> 8;
    return u;
  }, crc: (u, l, b) => 4294967295 ^ i.update(4294967295, u, l, b) };
  function e(u, l, b, C) {
    l[b] += u[0] * C >> 4, l[b + 1] += u[1] * C >> 4, l[b + 2] += u[2] * C >> 4, l[b + 3] += u[3] * C >> 4;
  }
  function t(u) {
    return Math.max(0, Math.min(255, u));
  }
  function c(u, l) {
    const b = u[0] - l[0], C = u[1] - l[1], E = u[2] - l[2], I = u[3] - l[3];
    return b * b + C * C + E * E + I * I;
  }
  function f(u, l, b, C, E, I, A) {
    A == null && (A = 1);
    const S = C.length, d = [];
    for (var s = 0; s < S; s++) {
      const R = C[s];
      d.push([R >>> 0 & 255, R >>> 8 & 255, R >>> 16 & 255, R >>> 24 & 255]);
    }
    for (s = 0; s < S; s++) {
      let R = 4294967295;
      for (var D = 0, _ = 0; _ < S; _++) {
        var x = c(d[s], d[_]);
        _ != s && x < R && (R = x, D = _);
      }
    }
    const N = new Uint32Array(E.buffer), B = new Int16Array(l * b * 4), Q = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    for (s = 0; s < Q.length; s++) Q[s] = 255 * ((Q[s] + 0.5) / 16 - 0.5);
    for (let R = 0; R < b; R++) for (let z = 0; z < l; z++) {
      var O;
      s = 4 * (R * l + z), A != 2 ? O = [t(u[s] + B[s]), t(u[s + 1] + B[s + 1]), t(u[s + 2] + B[s + 2]), t(u[s + 3] + B[s + 3])] : (x = Q[4 * (3 & R) + (3 & z)], O = [t(u[s] + x), t(u[s + 1] + x), t(u[s + 2] + x), t(u[s + 3] + x)]), D = 0;
      let Z = 16777215;
      for (_ = 0; _ < S; _++) {
        const j = c(O, d[_]);
        j < Z && (Z = j, D = _);
      }
      const q = d[D], W = [O[0] - q[0], O[1] - q[1], O[2] - q[2], O[3] - q[3]];
      A == 1 && (z != l - 1 && e(W, B, s + 4, 7), R != b - 1 && (z != 0 && e(W, B, s + 4 * l - 4, 3), e(W, B, s + 4 * l, 5), z != l - 1 && e(W, B, s + 4 * l + 4, 1))), I[s >> 2] = D, N[s >> 2] = C[D];
    }
  }
  function m(u, l, b, C, E) {
    E == null && (E = {});
    const { crc: I } = i, A = g.writeUint, S = g.writeUshort, d = g.writeASCII;
    let s = 8;
    const D = u.frames.length > 1;
    let _, x = !1, N = 33 + (D ? 20 : 0);
    if (E.sRGB != null && (N += 13), E.pHYs != null && (N += 21), E.iCCP != null && (_ = pako.deflate(E.iCCP), N += 21 + _.length + 4), u.ctype == 3) {
      for (var B = u.plte.length, Q = 0; Q < B; Q++) u.plte[Q] >>> 24 != 255 && (x = !0);
      N += 8 + 3 * B + 4 + (x ? 8 + 1 * B + 4 : 0);
    }
    for (var O = 0; O < u.frames.length; O++)
      D && (N += 38), N += (q = u.frames[O]).cimg.length + 12, O != 0 && (N += 4);
    N += 12;
    const R = new Uint8Array(N), z = [137, 80, 78, 71, 13, 10, 26, 10];
    for (Q = 0; Q < 8; Q++) R[Q] = z[Q];
    if (A(R, s, 13), s += 4, d(R, s, "IHDR"), s += 4, A(R, s, l), s += 4, A(R, s, b), s += 4, R[s] = u.depth, s++, R[s] = u.ctype, s++, R[s] = 0, s++, R[s] = 0, s++, R[s] = 0, s++, A(R, s, I(R, s - 17, 17)), s += 4, E.sRGB != null && (A(R, s, 1), s += 4, d(R, s, "sRGB"), s += 4, R[s] = E.sRGB, s++, A(R, s, I(R, s - 5, 5)), s += 4), E.iCCP != null) {
      const W = 13 + _.length;
      A(R, s, W), s += 4, d(R, s, "iCCP"), s += 4, d(R, s, "ICC profile"), s += 11, s += 2, R.set(_, s), s += _.length, A(R, s, I(R, s - (W + 4), W + 4)), s += 4;
    }
    if (E.pHYs != null && (A(R, s, 9), s += 4, d(R, s, "pHYs"), s += 4, A(R, s, E.pHYs[0]), s += 4, A(R, s, E.pHYs[1]), s += 4, R[s] = E.pHYs[2], s++, A(R, s, I(R, s - 13, 13)), s += 4), D && (A(R, s, 8), s += 4, d(R, s, "acTL"), s += 4, A(R, s, u.frames.length), s += 4, A(R, s, E.loop != null ? E.loop : 0), s += 4, A(R, s, I(R, s - 12, 12)), s += 4), u.ctype == 3) {
      for (A(R, s, 3 * (B = u.plte.length)), s += 4, d(R, s, "PLTE"), s += 4, Q = 0; Q < B; Q++) {
        const W = 3 * Q, j = u.plte[Q], J = 255 & j, te = j >>> 8 & 255, Ee = j >>> 16 & 255;
        R[s + W + 0] = J, R[s + W + 1] = te, R[s + W + 2] = Ee;
      }
      if (s += 3 * B, A(R, s, I(R, s - 3 * B - 4, 3 * B + 4)), s += 4, x) {
        for (A(R, s, B), s += 4, d(R, s, "tRNS"), s += 4, Q = 0; Q < B; Q++) R[s + Q] = u.plte[Q] >>> 24 & 255;
        s += B, A(R, s, I(R, s - B - 4, B + 4)), s += 4;
      }
    }
    let Z = 0;
    for (O = 0; O < u.frames.length; O++) {
      var q = u.frames[O];
      D && (A(R, s, 26), s += 4, d(R, s, "fcTL"), s += 4, A(R, s, Z++), s += 4, A(R, s, q.rect.width), s += 4, A(R, s, q.rect.height), s += 4, A(R, s, q.rect.x), s += 4, A(R, s, q.rect.y), s += 4, S(R, s, C[O]), s += 2, S(R, s, 1e3), s += 2, R[s] = q.dispose, s++, R[s] = q.blend, s++, A(R, s, I(R, s - 30, 30)), s += 4);
      const W = q.cimg;
      A(R, s, (B = W.length) + (O == 0 ? 0 : 4)), s += 4;
      const j = s;
      d(R, s, O == 0 ? "IDAT" : "fdAT"), s += 4, O != 0 && (A(R, s, Z++), s += 4), R.set(W, s), s += B, A(R, s, I(R, j, s - j)), s += 4;
    }
    return A(R, s, 0), s += 4, d(R, s, "IEND"), s += 4, A(R, s, I(R, s - 4, 4)), s += 4, R.buffer;
  }
  function U(u, l, b) {
    for (let C = 0; C < u.frames.length; C++) {
      const E = u.frames[C];
      E.rect.width;
      const I = E.rect.height, A = new Uint8Array(I * E.bpl + I);
      E.cimg = a(E.img, I, E.bpp, E.bpl, A, l, b);
    }
  }
  function r(u, l, b, C, E) {
    const I = E[0], A = E[1], S = E[2], d = E[3], s = E[4], D = E[5];
    let _ = 6, x = 8, N = 255;
    for (var B = 0; B < u.length; B++) {
      const re = new Uint8Array(u[B]);
      for (var Q = re.length, O = 0; O < Q; O += 4) N &= re[O + 3];
    }
    const R = N != 255, z = (function(Y, G, ne, ae, V, le) {
      const ee = [];
      for (var K = 0; K < Y.length; K++) {
        const se = new Uint8Array(Y[K]), he = new Uint32Array(se.buffer);
        var ue;
        let de = 0, be = 0, me = G, Fe = ne, Ze = ae ? 1 : 0;
        if (K != 0) {
          const xt = le || ae || K == 1 || ee[K - 2].dispose != 0 ? 1 : 2;
          let Ye = 0, ot = 1e9;
          for (let De = 0; De < xt; De++) {
            var we = new Uint8Array(Y[K - 1 - De]);
            const Ht = new Uint32Array(Y[K - 1 - De]);
            let ye = G, Ue = ne, xe = -1, Le = -1;
            for (let Ie = 0; Ie < ne; Ie++) for (let Se = 0; Se < G; Se++)
              he[oe = Ie * G + Se] != Ht[oe] && (Se < ye && (ye = Se), Se > xe && (xe = Se), Ie < Ue && (Ue = Ie), Ie > Le && (Le = Ie));
            xe == -1 && (ye = Ue = xe = Le = 0), V && ((1 & ye) == 1 && ye--, (1 & Ue) == 1 && Ue--);
            const it = (xe - ye + 1) * (Le - Ue + 1);
            it < ot && (ot = it, Ye = De, de = ye, be = Ue, me = xe - ye + 1, Fe = Le - Ue + 1);
          }
          we = new Uint8Array(Y[K - 1 - Ye]), Ye == 1 && (ee[K - 1].dispose = 2), ue = new Uint8Array(me * Fe * 4), h(we, G, ne, ue, me, Fe, -de, -be, 0), Ze = h(se, G, ne, ue, me, Fe, -de, -be, 3) ? 1 : 0, Ze == 1 ? n(se, G, ne, ue, { x: de, y: be, width: me, height: Fe }) : h(se, G, ne, ue, me, Fe, -de, -be, 0);
        } else ue = se.slice(0);
        ee.push({ rect: { x: de, y: be, width: me, height: Fe }, img: ue, blend: Ze, dispose: 0 });
      }
      if (ae) for (K = 0; K < ee.length; K++) {
        if ((Ce = ee[K]).blend == 1) continue;
        const se = Ce.rect, he = ee[K - 1].rect, de = Math.min(se.x, he.x), be = Math.min(se.y, he.y), me = { x: de, y: be, width: Math.max(se.x + se.width, he.x + he.width) - de, height: Math.max(se.y + se.height, he.y + he.height) - be };
        ee[K - 1].dispose = 1, K - 1 != 0 && o(Y, G, ne, ee, K - 1, me, V), o(Y, G, ne, ee, K, me, V);
      }
      let Oe = 0;
      if (Y.length != 1) for (var oe = 0; oe < ee.length; oe++) {
        var Ce;
        Oe += (Ce = ee[oe]).rect.width * Ce.rect.height;
      }
      return ee;
    })(u, l, b, I, A, S), Z = {}, q = [], W = [];
    if (C != 0) {
      const re = [];
      for (O = 0; O < z.length; O++) re.push(z[O].img.buffer);
      const Y = (function(V) {
        let le = 0;
        for (var ee = 0; ee < V.length; ee++) le += V[ee].byteLength;
        const K = new Uint8Array(le);
        let ue = 0;
        for (ee = 0; ee < V.length; ee++) {
          const we = new Uint8Array(V[ee]), Oe = we.length;
          for (let oe = 0; oe < Oe; oe += 4) {
            let Ce = we[oe], se = we[oe + 1], he = we[oe + 2];
            const de = we[oe + 3];
            de == 0 && (Ce = se = he = 0), K[ue + oe] = Ce, K[ue + oe + 1] = se, K[ue + oe + 2] = he, K[ue + oe + 3] = de;
          }
          ue += Oe;
        }
        return K.buffer;
      })(re), G = F(Y, C);
      for (O = 0; O < G.plte.length; O++) q.push(G.plte[O].est.rgba);
      let ne = 0;
      for (O = 0; O < z.length; O++) {
        const ae = (J = z[O]).img.length;
        var j = new Uint8Array(G.inds.buffer, ne >> 2, ae >> 2);
        W.push(j);
        const V = new Uint8Array(G.abuf, ne, ae);
        D && f(J.img, J.rect.width, J.rect.height, q, V, j), J.img.set(V), ne += ae;
      }
    } else for (B = 0; B < z.length; B++) {
      var J = z[B];
      const re = new Uint32Array(J.img.buffer);
      var te = J.rect.width;
      for (Q = re.length, j = new Uint8Array(Q), W.push(j), O = 0; O < Q; O++) {
        const Y = re[O];
        if (O != 0 && Y == re[O - 1]) j[O] = j[O - 1];
        else if (O > te && Y == re[O - te]) j[O] = j[O - te];
        else {
          let G = Z[Y];
          if (G == null && (Z[Y] = G = q.length, q.push(Y), q.length >= 300)) break;
          j[O] = G;
        }
      }
    }
    const Ee = q.length;
    for (Ee <= 256 && s == 0 && (x = Ee <= 2 ? 1 : Ee <= 4 ? 2 : Ee <= 16 ? 4 : 8, x = Math.max(x, d)), B = 0; B < z.length; B++) {
      (J = z[B]).rect.x, J.rect.y, te = J.rect.width;
      const re = J.rect.height;
      let Y = J.img;
      new Uint32Array(Y.buffer);
      let G = 4 * te, ne = 4;
      if (Ee <= 256 && s == 0) {
        G = Math.ceil(x * te / 8);
        var pe = new Uint8Array(G * re);
        const ae = W[B];
        for (let V = 0; V < re; V++) {
          O = V * G;
          const le = V * te;
          if (x == 8) for (var X = 0; X < te; X++) pe[O + X] = ae[le + X];
          else if (x == 4) for (X = 0; X < te; X++) pe[O + (X >> 1)] |= ae[le + X] << 4 - 4 * (1 & X);
          else if (x == 2) for (X = 0; X < te; X++) pe[O + (X >> 2)] |= ae[le + X] << 6 - 2 * (3 & X);
          else if (x == 1) for (X = 0; X < te; X++) pe[O + (X >> 3)] |= ae[le + X] << 7 - 1 * (7 & X);
        }
        Y = pe, _ = 3, ne = 1;
      } else if (R == 0 && z.length == 1) {
        pe = new Uint8Array(te * re * 3);
        const ae = te * re;
        for (O = 0; O < ae; O++) {
          const V = 3 * O, le = 4 * O;
          pe[V] = Y[le], pe[V + 1] = Y[le + 1], pe[V + 2] = Y[le + 2];
        }
        Y = pe, _ = 2, ne = 3, G = 3 * te;
      }
      J.img = Y, J.bpl = G, J.bpp = ne;
    }
    return { ctype: _, depth: x, plte: q, frames: z };
  }
  function o(u, l, b, C, E, I, A) {
    const S = Uint8Array, d = Uint32Array, s = new S(u[E - 1]), D = new d(u[E - 1]), _ = E + 1 < u.length ? new S(u[E + 1]) : null, x = new S(u[E]), N = new d(x.buffer);
    let B = l, Q = b, O = -1, R = -1;
    for (let Z = 0; Z < I.height; Z++) for (let q = 0; q < I.width; q++) {
      const W = I.x + q, j = I.y + Z, J = j * l + W, te = N[J];
      te == 0 || C[E - 1].dispose == 0 && D[J] == te && (_ == null || _[4 * J + 3] != 0) || (W < B && (B = W), W > O && (O = W), j < Q && (Q = j), j > R && (R = j));
    }
    O == -1 && (B = Q = O = R = 0), A && ((1 & B) == 1 && B--, (1 & Q) == 1 && Q--), I = { x: B, y: Q, width: O - B + 1, height: R - Q + 1 };
    const z = C[E];
    z.rect = I, z.blend = 1, z.img = new Uint8Array(I.width * I.height * 4), C[E - 1].dispose == 0 ? (h(s, l, b, z.img, I.width, I.height, -I.x, -I.y, 0), n(x, l, b, z.img, I)) : h(x, l, b, z.img, I.width, I.height, -I.x, -I.y, 0);
  }
  function n(u, l, b, C, E) {
    h(u, l, b, C, E.width, E.height, -E.x, -E.y, 2);
  }
  function a(u, l, b, C, E, I, A) {
    const S = [];
    let d, s = [0, 1, 2, 3, 4];
    I != -1 ? s = [I] : (l * C > 5e5 || b == 1) && (s = [0]), A && (d = { level: 0 });
    const D = Gt;
    for (var _ = 0; _ < s.length; _++) {
      for (let B = 0; B < l; B++) p(E, u, B, C, b, s[_]);
      S.push(D.deflate(E, d));
    }
    let x, N = 1e9;
    for (_ = 0; _ < S.length; _++) S[_].length < N && (x = _, N = S[_].length);
    return S[x];
  }
  function p(u, l, b, C, E, I) {
    const A = b * C;
    let S = A + b;
    if (u[S] = I, S++, I == 0) if (C < 500) for (var d = 0; d < C; d++) u[S + d] = l[A + d];
    else u.set(new Uint8Array(l.buffer, A, C), S);
    else if (I == 1) {
      for (d = 0; d < E; d++) u[S + d] = l[A + d];
      for (d = E; d < C; d++) u[S + d] = l[A + d] - l[A + d - E] + 256 & 255;
    } else if (b == 0) {
      for (d = 0; d < E; d++) u[S + d] = l[A + d];
      if (I == 2) for (d = E; d < C; d++) u[S + d] = l[A + d];
      if (I == 3) for (d = E; d < C; d++) u[S + d] = l[A + d] - (l[A + d - E] >> 1) + 256 & 255;
      if (I == 4) for (d = E; d < C; d++) u[S + d] = l[A + d] - y(l[A + d - E], 0, 0) + 256 & 255;
    } else {
      if (I == 2) for (d = 0; d < C; d++) u[S + d] = l[A + d] + 256 - l[A + d - C] & 255;
      if (I == 3) {
        for (d = 0; d < E; d++) u[S + d] = l[A + d] + 256 - (l[A + d - C] >> 1) & 255;
        for (d = E; d < C; d++) u[S + d] = l[A + d] + 256 - (l[A + d - C] + l[A + d - E] >> 1) & 255;
      }
      if (I == 4) {
        for (d = 0; d < E; d++) u[S + d] = l[A + d] + 256 - y(0, l[A + d - C], 0) & 255;
        for (d = E; d < C; d++) u[S + d] = l[A + d] + 256 - y(l[A + d - E], l[A + d - C], l[A + d - E - C]) & 255;
      }
    }
  }
  function F(u, l) {
    const b = new Uint8Array(u), C = b.slice(0), E = new Uint32Array(C.buffer), I = T(C, l), A = I[0], S = I[1], d = b.length, s = new Uint8Array(d >> 2);
    let D;
    if (b.length < 2e7) for (var _ = 0; _ < d; _ += 4)
      D = w(A, x = b[_] * (1 / 255), N = b[_ + 1] * (1 / 255), B = b[_ + 2] * (1 / 255), Q = b[_ + 3] * (1 / 255)), s[_ >> 2] = D.ind, E[_ >> 2] = D.est.rgba;
    else for (_ = 0; _ < d; _ += 4) {
      var x = b[_] * 0.00392156862745098, N = b[_ + 1] * (1 / 255), B = b[_ + 2] * (1 / 255), Q = b[_ + 3] * (1 / 255);
      for (D = A; D.left; ) D = L(D.est, x, N, B, Q) <= 0 ? D.left : D.right;
      s[_ >> 2] = D.ind, E[_ >> 2] = D.est.rgba;
    }
    return { abuf: C.buffer, inds: s, plte: S };
  }
  function T(u, l, b) {
    b == null && (b = 1e-4);
    const C = new Uint32Array(u.buffer), E = { i0: 0, i1: u.length, bst: null, est: null, tdst: 0, left: null, right: null };
    E.bst = P(u, E.i0, E.i1), E.est = v(E.bst);
    const I = [E];
    for (; I.length < l; ) {
      let S = 0, d = 0;
      for (var A = 0; A < I.length; A++) I[A].est.L > S && (S = I[A].est.L, d = A);
      if (S < b) break;
      const s = I[d], D = H(u, C, s.i0, s.i1, s.est.e, s.est.eMq255);
      if (s.i0 >= D || s.i1 <= D) {
        s.est.L = 0;
        continue;
      }
      const _ = { i0: s.i0, i1: D, bst: null, est: null, tdst: 0, left: null, right: null };
      _.bst = P(u, _.i0, _.i1), _.est = v(_.bst);
      const x = { i0: D, i1: s.i1, bst: null, est: null, tdst: 0, left: null, right: null };
      for (x.bst = { R: [], m: [], N: s.bst.N - _.bst.N }, A = 0; A < 16; A++) x.bst.R[A] = s.bst.R[A] - _.bst.R[A];
      for (A = 0; A < 4; A++) x.bst.m[A] = s.bst.m[A] - _.bst.m[A];
      x.est = v(x.bst), s.left = _, s.right = x, I[d] = _, I.push(x);
    }
    for (I.sort(((S, d) => d.bst.N - S.bst.N)), A = 0; A < I.length; A++) I[A].ind = A;
    return [E, I];
  }
  function w(u, l, b, C, E) {
    if (u.left == null) return u.tdst = (function(_, x, N, B, Q) {
      const O = x - _[0], R = N - _[1], z = B - _[2], Z = Q - _[3];
      return O * O + R * R + z * z + Z * Z;
    })(u.est.q, l, b, C, E), u;
    const I = L(u.est, l, b, C, E);
    let A = u.left, S = u.right;
    I > 0 && (A = u.right, S = u.left);
    const d = w(A, l, b, C, E);
    if (d.tdst <= I * I) return d;
    const s = w(S, l, b, C, E);
    return s.tdst < d.tdst ? s : d;
  }
  function L(u, l, b, C, E) {
    const { e: I } = u;
    return I[0] * l + I[1] * b + I[2] * C + I[3] * E - u.eMq;
  }
  function H(u, l, b, C, E, I) {
    for (C -= 4; b < C; ) {
      for (; M(u, b, E) <= I; ) b += 4;
      for (; M(u, C, E) > I; ) C -= 4;
      if (b >= C) break;
      const A = l[b >> 2];
      l[b >> 2] = l[C >> 2], l[C >> 2] = A, b += 4, C -= 4;
    }
    for (; M(u, b, E) > I; ) b -= 4;
    return b + 4;
  }
  function M(u, l, b) {
    return u[l] * b[0] + u[l + 1] * b[1] + u[l + 2] * b[2] + u[l + 3] * b[3];
  }
  function P(u, l, b) {
    const C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], E = [0, 0, 0, 0], I = b - l >> 2;
    for (let A = l; A < b; A += 4) {
      const S = u[A] * 0.00392156862745098, d = u[A + 1] * (1 / 255), s = u[A + 2] * (1 / 255), D = u[A + 3] * (1 / 255);
      E[0] += S, E[1] += d, E[2] += s, E[3] += D, C[0] += S * S, C[1] += S * d, C[2] += S * s, C[3] += S * D, C[5] += d * d, C[6] += d * s, C[7] += d * D, C[10] += s * s, C[11] += s * D, C[15] += D * D;
    }
    return C[4] = C[1], C[8] = C[2], C[9] = C[6], C[12] = C[3], C[13] = C[7], C[14] = C[11], { R: C, m: E, N: I };
  }
  function v(u) {
    const { R: l } = u, { m: b } = u, { N: C } = u, E = b[0], I = b[1], A = b[2], S = b[3], d = C == 0 ? 0 : 1 / C, s = [l[0] - E * E * d, l[1] - E * I * d, l[2] - E * A * d, l[3] - E * S * d, l[4] - I * E * d, l[5] - I * I * d, l[6] - I * A * d, l[7] - I * S * d, l[8] - A * E * d, l[9] - A * I * d, l[10] - A * A * d, l[11] - A * S * d, l[12] - S * E * d, l[13] - S * I * d, l[14] - S * A * d, l[15] - S * S * d], D = s, _ = k;
    let x = [Math.random(), Math.random(), Math.random(), Math.random()], N = 0, B = 0;
    if (C != 0) for (let O = 0; O < 16 && (x = _.multVec(D, x), B = Math.sqrt(_.dot(x, x)), x = _.sml(1 / B, x), !(O != 0 && Math.abs(B - N) < 1e-9)); O++) N = B;
    const Q = [E * d, I * d, A * d, S * d];
    return { Cov: s, q: Q, e: x, L: N, eMq255: _.dot(_.sml(255, Q), x), eMq: _.dot(x, Q), rgba: (Math.round(255 * Q[3]) << 24 | Math.round(255 * Q[2]) << 16 | Math.round(255 * Q[1]) << 8 | Math.round(255 * Q[0]) << 0) >>> 0 };
  }
  var k = { multVec: (u, l) => [u[0] * l[0] + u[1] * l[1] + u[2] * l[2] + u[3] * l[3], u[4] * l[0] + u[5] * l[1] + u[6] * l[2] + u[7] * l[3], u[8] * l[0] + u[9] * l[1] + u[10] * l[2] + u[11] * l[3], u[12] * l[0] + u[13] * l[1] + u[14] * l[2] + u[15] * l[3]], dot: (u, l) => u[0] * l[0] + u[1] * l[1] + u[2] * l[2] + u[3] * l[3], sml: (u, l) => [u * l[0], u * l[1], u * l[2], u * l[3]] };
  ge.encode = function(l, b, C, E, I, A, S) {
    E == null && (E = 0), S == null && (S = !1);
    const d = r(l, b, C, E, [!1, !1, !1, 0, S, !1]);
    return U(d, -1), m(d, b, C, I, A);
  }, ge.encodeLL = function(l, b, C, E, I, A, S, d) {
    const s = { ctype: 0 + (E == 1 ? 0 : 2) + (I == 0 ? 0 : 4), depth: A, frames: [] }, D = (E + I) * A, _ = D * b;
    for (let x = 0; x < l.length; x++) s.frames.push({ rect: { x: 0, y: 0, width: b, height: C }, img: new Uint8Array(l[x]), blend: 0, dispose: 1, bpp: Math.ceil(D / 8), bpl: Math.ceil(_ / 8) });
    return U(s, 0, !0), m(s, b, C, S, d);
  }, ge.encode.compress = r, ge.encode.dither = f, ge.quantize = F, ge.quantize.getKDtree = T, ge.quantize.getNearest = w;
})();
const mt = { toArrayBuffer(h, g) {
  const y = h.width, i = h.height, e = y << 2, t = h.getContext("2d").getImageData(0, 0, y, i), c = new Uint32Array(t.data.buffer), f = (32 * y + 31) / 32 << 2, m = f * i, U = 122 + m, r = new ArrayBuffer(U), o = new DataView(r), n = 1 << 20;
  let a, p, F, T, w = n, L = 0, H = 0, M = 0;
  function P(u) {
    o.setUint16(H, u, !0), H += 2;
  }
  function v(u) {
    o.setUint32(H, u, !0), H += 4;
  }
  function k(u) {
    H += u;
  }
  P(19778), v(U), k(4), v(122), v(108), v(y), v(-i >>> 0), P(1), P(32), v(3), v(m), v(2835), v(2835), k(8), v(16711680), v(65280), v(255), v(4278190080), v(1466527264), (function u() {
    for (; L < i && w > 0; ) {
      for (T = 122 + L * f, a = 0; a < e; ) w--, p = c[M++], F = p >>> 24, o.setUint32(T + a, p << 8 | F), a += 4;
      L++;
    }
    M < c.length ? (w = n, setTimeout(u, mt._dly)) : g(r);
  })();
}, toBlob(h, g) {
  this.toArrayBuffer(h, ((y) => {
    g(new Blob([y], { type: "image/bmp" }));
  }));
}, _dly: 9 };
var ce = { CHROME: "CHROME", FIREFOX: "FIREFOX", DESKTOP_SAFARI: "DESKTOP_SAFARI", IE: "IE", IOS: "IOS", ETC: "ETC" }, Kt = { [ce.CHROME]: 16384, [ce.FIREFOX]: 11180, [ce.DESKTOP_SAFARI]: 16384, [ce.IE]: 8192, [ce.IOS]: 4096, [ce.ETC]: 8192 };
const et = typeof window < "u", vt = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope, qe = et && window.cordova && window.cordova.require && window.cordova.require("cordova/modulemapper"), Zt = (et || vt) && (qe && qe.getOriginalSymbol(window, "File") || typeof File < "u" && File), At = (et || vt) && (qe && qe.getOriginalSymbol(window, "FileReader") || typeof FileReader < "u" && FileReader);
function tt(h, g, y = Date.now()) {
  return new Promise(((i) => {
    const e = h.split(","), t = e[0].match(/:(.*?);/)[1], c = globalThis.atob(e[1]);
    let f = c.length;
    const m = new Uint8Array(f);
    for (; f--; ) m[f] = c.charCodeAt(f);
    const U = new Blob([m], { type: t });
    U.name = g, U.lastModified = y, i(U);
  }));
}
function bt(h) {
  return new Promise(((g, y) => {
    const i = new At();
    i.onload = () => g(i.result), i.onerror = (e) => y(e), i.readAsDataURL(h);
  }));
}
function wt(h) {
  return new Promise(((g, y) => {
    const i = new Image();
    i.onload = () => g(i), i.onerror = (e) => y(e), i.src = h;
  }));
}
function Me() {
  if (Me.cachedResult !== void 0) return Me.cachedResult;
  let h = ce.ETC;
  const { userAgent: g } = navigator;
  return /Chrom(e|ium)/i.test(g) ? h = ce.CHROME : /iP(ad|od|hone)/i.test(g) && /WebKit/i.test(g) ? h = ce.IOS : /Safari/i.test(g) ? h = ce.DESKTOP_SAFARI : /Firefox/i.test(g) ? h = ce.FIREFOX : (/MSIE/i.test(g) || document.documentMode) && (h = ce.IE), Me.cachedResult = h, Me.cachedResult;
}
function yt(h, g) {
  const y = Me(), i = Kt[y];
  let e = h, t = g, c = e * t;
  const f = e > t ? t / e : e / t;
  for (; c > i * i; ) {
    const m = (i + e) / 2, U = (i + t) / 2;
    m < U ? (t = U, e = U * f) : (t = m * f, e = m), c = e * t;
  }
  return { width: e, height: t };
}
function Ke(h, g) {
  let y, i;
  try {
    if (y = new OffscreenCanvas(h, g), i = y.getContext("2d"), i === null) throw new Error("getContext of OffscreenCanvas returns null");
  } catch {
    y = document.createElement("canvas"), i = y.getContext("2d");
  }
  return y.width = h, y.height = g, [y, i];
}
function Ut(h, g) {
  const { width: y, height: i } = yt(h.width, h.height), [e, t] = Ke(y, i);
  return g && /jpe?g/.test(g) && (t.fillStyle = "white", t.fillRect(0, 0, e.width, e.height)), t.drawImage(h, 0, 0, e.width, e.height), e;
}
function Ne() {
  return Ne.cachedResult !== void 0 || (Ne.cachedResult = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || navigator.userAgent.includes("Mac") && typeof document < "u" && "ontouchend" in document), Ne.cachedResult;
}
function je(h, g = {}) {
  return new Promise((function(y, i) {
    let e, t;
    var c = function() {
      try {
        return t = Ut(e, g.fileType || h.type), y([e, t]);
      } catch (m) {
        return i(m);
      }
    }, f = function(m) {
      try {
        var U = function(r) {
          try {
            throw r;
          } catch (o) {
            return i(o);
          }
        };
        try {
          let r;
          return bt(h).then((function(o) {
            try {
              return r = o, wt(r).then((function(n) {
                try {
                  return e = n, (function() {
                    try {
                      return c();
                    } catch (a) {
                      return i(a);
                    }
                  })();
                } catch (a) {
                  return U(a);
                }
              }), U);
            } catch (n) {
              return U(n);
            }
          }), U);
        } catch (r) {
          U(r);
        }
      } catch (r) {
        return i(r);
      }
    };
    try {
      if (Ne() || [ce.DESKTOP_SAFARI, ce.MOBILE_SAFARI].includes(Me())) throw new Error("Skip createImageBitmap on IOS and Safari");
      return createImageBitmap(h).then((function(m) {
        try {
          return e = m, c();
        } catch {
          return f();
        }
      }), f);
    } catch {
      f();
    }
  }));
}
function Ge(h, g, y, i, e = 1) {
  return new Promise((function(t, c) {
    let f;
    if (g === "image/png") {
      let o, n, a;
      return o = h.getContext("2d"), { data: n } = o.getImageData(0, 0, h.width, h.height), a = ge.encode([n.buffer], h.width, h.height, 4096 * e), f = new Blob([a], { type: g }), f.name = y, f.lastModified = i, m.call(this);
    }
    {
      let o = function() {
        return m.call(this);
      };
      var U = o;
      if (g === "image/bmp") return new Promise(((n) => mt.toBlob(h, n))).then((function(n) {
        try {
          return f = n, f.name = y, f.lastModified = i, o.call(this);
        } catch (a) {
          return c(a);
        }
      }).bind(this), c);
      {
        let n = function() {
          return o.call(this);
        };
        var r = n;
        if (typeof OffscreenCanvas == "function" && h instanceof OffscreenCanvas) return h.convertToBlob({ type: g, quality: e }).then((function(a) {
          try {
            return f = a, f.name = y, f.lastModified = i, n.call(this);
          } catch (p) {
            return c(p);
          }
        }).bind(this), c);
        {
          let a;
          return a = h.toDataURL(g, e), tt(a, y, i).then((function(p) {
            try {
              return f = p, n.call(this);
            } catch (F) {
              return c(F);
            }
          }).bind(this), c);
        }
      }
    }
    function m() {
      return t(f);
    }
  }));
}
function ve(h) {
  h.width = 0, h.height = 0;
}
function He() {
  return new Promise((function(h, g) {
    let y, i, e, t;
    return He.cachedResult !== void 0 ? h(He.cachedResult) : tt("data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==", "test.jpg", Date.now()).then((function(c) {
      try {
        return y = c, je(y).then((function(f) {
          try {
            return i = f[1], Ge(i, y.type, y.name, y.lastModified).then((function(m) {
              try {
                return e = m, ve(i), je(e).then((function(U) {
                  try {
                    return t = U[0], He.cachedResult = t.width === 1 && t.height === 2, h(He.cachedResult);
                  } catch (r) {
                    return g(r);
                  }
                }), g);
              } catch (U) {
                return g(U);
              }
            }), g);
          } catch (m) {
            return g(m);
          }
        }), g);
      } catch (f) {
        return g(f);
      }
    }), g);
  }));
}
function Et(h) {
  return new Promise(((g, y) => {
    const i = new At();
    i.onload = (e) => {
      const t = new DataView(e.target.result);
      if (t.getUint16(0, !1) != 65496) return g(-2);
      const c = t.byteLength;
      let f = 2;
      for (; f < c; ) {
        if (t.getUint16(f + 2, !1) <= 8) return g(-1);
        const m = t.getUint16(f, !1);
        if (f += 2, m == 65505) {
          if (t.getUint32(f += 2, !1) != 1165519206) return g(-1);
          const U = t.getUint16(f += 6, !1) == 18761;
          f += t.getUint32(f + 4, U);
          const r = t.getUint16(f, U);
          f += 2;
          for (let o = 0; o < r; o++) if (t.getUint16(f + 12 * o, U) == 274) return g(t.getUint16(f + 12 * o + 8, U));
        } else {
          if ((65280 & m) != 65280) break;
          f += t.getUint16(f, !1);
        }
      }
      return g(-1);
    }, i.onerror = (e) => y(e), i.readAsArrayBuffer(h);
  }));
}
function Ct(h, g) {
  const { width: y } = h, { height: i } = h, { maxWidthOrHeight: e } = g;
  let t, c = h;
  return isFinite(e) && (y > e || i > e) && ([c, t] = Ke(y, i), y > i ? (c.width = e, c.height = i / y * e) : (c.width = y / i * e, c.height = e), t.drawImage(h, 0, 0, c.width, c.height), ve(h)), c;
}
function Ft(h, g) {
  const { width: y } = h, { height: i } = h, [e, t] = Ke(y, i);
  switch (g > 4 && g < 9 ? (e.width = i, e.height = y) : (e.width = y, e.height = i), g) {
    case 2:
      t.transform(-1, 0, 0, 1, y, 0);
      break;
    case 3:
      t.transform(-1, 0, 0, -1, y, i);
      break;
    case 4:
      t.transform(1, 0, 0, -1, 0, i);
      break;
    case 5:
      t.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      t.transform(0, 1, -1, 0, i, 0);
      break;
    case 7:
      t.transform(0, -1, -1, 0, i, y);
      break;
    case 8:
      t.transform(0, -1, 1, 0, 0, y);
  }
  return t.drawImage(h, 0, 0, y, i), ve(h), e;
}
function st(h, g, y = 0) {
  return new Promise((function(i, e) {
    let t, c, f, m, U, r, o, n, a, p, F, T, w, L, H, M, P, v, k, u;
    function l(C = 5) {
      if (g.signal && g.signal.aborted) throw g.signal.reason;
      t += C, g.onProgress(Math.min(t, 100));
    }
    function b(C) {
      if (g.signal && g.signal.aborted) throw g.signal.reason;
      t = Math.min(Math.max(C, t), 100), g.onProgress(t);
    }
    return t = y, c = g.maxIteration || 10, f = 1024 * g.maxSizeMB * 1024, l(), je(h, g).then((function(C) {
      try {
        return [, m] = C, l(), U = Ct(m, g), l(), new Promise((function(E, I) {
          var A;
          if (!(A = g.exifOrientation)) return Et(h).then((function(d) {
            try {
              return A = d, S.call(this);
            } catch (s) {
              return I(s);
            }
          }).bind(this), I);
          function S() {
            return E(A);
          }
          return S.call(this);
        })).then((function(E) {
          try {
            return r = E, l(), He().then((function(I) {
              try {
                return o = I ? U : Ft(U, r), l(), n = g.initialQuality || 1, a = g.fileType || h.type, Ge(o, a, h.name, h.lastModified, n).then((function(A) {
                  try {
                    {
                      let D = function() {
                        if (c-- && (H > f || H > w)) {
                          let x, N;
                          return x = u ? 0.95 * k.width : k.width, N = u ? 0.95 * k.height : k.height, [P, v] = Ke(x, N), v.drawImage(k, 0, 0, x, N), n *= a === "image/png" ? 0.85 : 0.95, Ge(P, a, h.name, h.lastModified, n).then((function(B) {
                            try {
                              return M = B, ve(k), k = P, H = M.size, b(Math.min(99, Math.floor((L - H) / (L - f) * 100))), D;
                            } catch (Q) {
                              return e(Q);
                            }
                          }), e);
                        }
                        return [1];
                      }, _ = function() {
                        return ve(k), ve(P), ve(U), ve(o), ve(m), b(100), i(M);
                      };
                      var d = D, s = _;
                      if (p = A, l(), F = p.size > f, T = p.size > h.size, !F && !T) return b(100), i(p);
                      var S;
                      return w = h.size, L = p.size, H = L, k = o, u = !g.alwaysKeepResolution && F, (S = (function(x) {
                        for (; x; ) {
                          if (x.then) return void x.then(S, e);
                          try {
                            if (x.pop) {
                              if (x.length) return x.pop() ? _.call(this) : x;
                              x = D;
                            } else x = x.call(this);
                          } catch (N) {
                            return e(N);
                          }
                        }
                      }).bind(this))(D);
                    }
                  } catch (D) {
                    return e(D);
                  }
                }).bind(this), e);
              } catch (A) {
                return e(A);
              }
            }).bind(this), e);
          } catch (I) {
            return e(I);
          }
        }).bind(this), e);
      } catch (E) {
        return e(E);
      }
    }).bind(this), e);
  }));
}
const Yt = `
let scriptImported = false
self.addEventListener('message', async (e) => {
  const { file, id, imageCompressionLibUrl, options } = e.data
  options.onProgress = (progress) => self.postMessage({ progress, id })
  try {
    if (!scriptImported) {
      // console.log('[worker] importScripts', imageCompressionLibUrl)
      self.importScripts(imageCompressionLibUrl)
      scriptImported = true
    }
    // console.log('[worker] self', self)
    const compressedFile = await imageCompression(file, options)
    self.postMessage({ file: compressedFile, id })
  } catch (e) {
    // console.error('[worker] error', e)
    self.postMessage({ error: e.message + '\\n' + e.stack, id })
  }
})
`;
let Xe;
function Xt(h, g) {
  return new Promise(((y, i) => {
    Xe || (Xe = (function(c) {
      const f = [];
      return f.push(c), URL.createObjectURL(new Blob(f));
    })(Yt));
    const e = new Worker(Xe);
    e.addEventListener("message", (function(c) {
      if (g.signal && g.signal.aborted) e.terminate();
      else if (c.data.progress === void 0) {
        if (c.data.error) return i(new Error(c.data.error)), void e.terminate();
        y(c.data.file), e.terminate();
      } else g.onProgress(c.data.progress);
    })), e.addEventListener("error", i), g.signal && g.signal.addEventListener("abort", (() => {
      i(g.signal.reason), e.terminate();
    })), e.postMessage({ file: h, imageCompressionLibUrl: g.libURL, options: { ...g, onProgress: void 0, signal: void 0 } });
  }));
}
function ie(h, g) {
  return new Promise((function(y, i) {
    let e, t, c, f, m, U;
    if (e = { ...g }, c = 0, { onProgress: f } = e, e.maxSizeMB = e.maxSizeMB || Number.POSITIVE_INFINITY, m = typeof e.useWebWorker != "boolean" || e.useWebWorker, delete e.useWebWorker, e.onProgress = (a) => {
      c = a, typeof f == "function" && f(c);
    }, !(h instanceof Blob || h instanceof Zt)) return i(new Error("The file given is not an instance of Blob or File"));
    if (!/^image/.test(h.type)) return i(new Error("The file given is not an image"));
    if (U = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope, !m || typeof Worker != "function" || U) return st(h, e).then((function(a) {
      try {
        return t = a, n.call(this);
      } catch (p) {
        return i(p);
      }
    }).bind(this), i);
    var r = (function() {
      try {
        return n.call(this);
      } catch (a) {
        return i(a);
      }
    }).bind(this), o = function(a) {
      try {
        return st(h, e).then((function(p) {
          try {
            return t = p, r();
          } catch (F) {
            return i(F);
          }
        }), i);
      } catch (p) {
        return i(p);
      }
    };
    try {
      return e.libURL = e.libURL || "https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js", Xt(h, e).then((function(a) {
        try {
          return t = a, r();
        } catch {
          return o();
        }
      }), o);
    } catch {
      o();
    }
    function n() {
      try {
        t.name = h.name, t.lastModified = h.lastModified;
      } catch {
      }
      try {
        e.preserveExif && h.type === "image/jpeg" && (!e.fileType || e.fileType && e.fileType === h.type) && (t = pt(h, t));
      } catch {
      }
      return y(t);
    }
  }));
}
ie.getDataUrlFromFile = bt, ie.getFilefromDataUrl = tt, ie.loadImage = wt, ie.drawImageInCanvas = Ut, ie.drawFileInCanvas = je, ie.canvasToFile = Ge, ie.getExifOrientation = Et, ie.handleMaxWidthOrHeight = Ct, ie.followExifOrientation = Ft, ie.cleanupCanvasMemory = ve, ie.isAutoOrientationInBrowser = He, ie.approximateBelowMaximumCanvasSizeOfBrowser = yt, ie.copyExifWithoutOrientation = pt, ie.getBrowserName = Me, ie.version = "2.0.2";
const ft = (h, g) => {
  if (!g) {
    Ot(h, "disabled", !0);
    return;
  }
  Bt(h, "disabled"), Qt(h);
}, ct = (h, g) => {
  const y = "ci-spinner", i = fe(`#${y}`, h);
  if (!g && i[0]) {
    Ve(i);
    return;
  }
  if (g && !i[0]) {
    const e = Re(`<div id="${y}"></div>`);
    _e(h, e);
  }
}, nt = (h) => {
  const g = ke() ? ".chat-form" : "#chat-form", y = fe(g, h), i = fe("#chat-message", h);
  return {
    on() {
      ft(i, !1), ct(y, !0);
    },
    off() {
      ft(i, !0), ct(y, !1);
    }
  };
}, It = async (h) => {
  const g = h || rt("uploadLocation");
  try {
    (await Qe().browse(Be, g)).target === "." && await Qe().createDirectory(Be, g, {});
  } catch {
    try {
      await Qe().createDirectory(Be, g, {});
    } catch {
    }
  }
}, Jt = (h, g) => game.settings.set("chat-images", h, g), Vt = () => [
  {
    key: "uploadButton",
    options: {
      name: Ae("uploadButton"),
      hint: Ae("uploadButtonHint"),
      type: Boolean,
      default: !0,
      config: !0,
      requiresReload: !0
    }
  },
  {
    key: "uploadLocation",
    options: {
      name: Ae("uploadLocation"),
      hint: Ae("uploadLocationHint"),
      type: String,
      default: "uploaded-chat-images",
      scope: "world",
      config: !0,
      restricted: !0,
      onChange: async (h) => {
        const g = "uploaded-chat-images";
        let y = h.trim(), i = !1;
        y || (y = g, i = !0), y = y.replace(/\s+/g, "-"), h !== y && (i = !0), await It(y), i && await Jt("uploadLocation", y);
      }
    }
  }
], en = (h) => game.settings.register("chat-images", h.key, h.options), rt = (h) => game.settings.get("chat-images", h), tn = ["static.wikia"], nn = new DOMParser();
let Te = [];
const St = (h) => h.type && h.type.startsWith("image/"), rn = ({ imageSrc: h, id: g }) => Re(
  `<div id="${g}" class="ci-upload-area-image">
            <i class="ci-remove-image-icon fa-regular fa-circle-xmark"></i>
            <img class="ci-image-preview" src="${h}" alt="${Ae("unableToLoadImage")}"/>
        </div>`
), on = (h, g, y) => {
  Pe(h, "click", () => {
    const e = fe(`#${g.id}`, y);
    Ve(e), Te = Te.filter((t) => g.id !== t.id), !Te.length && Je(y, "hidden");
  });
}, an = async (h) => {
  const g = (y) => {
    const { type: i, name: e, id: t } = y, c = e?.substring(e.lastIndexOf("."), e.length) || i?.replace("image/", ".") || ".jpeg";
    return `${t}${c}`;
  };
  try {
    const y = g(h), i = await ie(h.file, { maxSizeMB: 1.5, useWebWorker: !0, alwaysKeepResolution: !0 }), e = new File([i], y, { type: h.type }), t = rt("uploadLocation"), c = await Qe().upload(Be, t, e, {}, { notify: !1 });
    return !c || !c?.path ? h.imageSrc : c?.path;
  } catch {
    return h.imageSrc;
  }
}, _t = async (h, g) => {
  const y = nt(g);
  y.on();
  const i = fe("#ci-chat-upload-area", g);
  if (!i || !i[0]) return;
  if (h.file) {
    if (!gt()) {
      y.off();
      return;
    }
    h.imageSrc = await an(h);
  }
  const e = rn(h);
  if (!e || !e[0]) return;
  Lt(i, "hidden"), _e(i, e), Te.push(h);
  const t = fe(".ci-remove-image-icon", e);
  on(t, h, i), y.off();
}, sn = (h, g) => async (y) => {
  const i = y.target?.result, e = { type: h.type, name: h.name, imageSrc: i, id: ht(), file: h };
  await _t(e, g);
}, Mt = (h, g) => {
  for (let y = 0; y < h.length; y++) {
    const i = h[y];
    if (!St(i)) continue;
    const e = new FileReader();
    e.addEventListener("load", sn(i, g)), e.readAsDataURL(i);
  }
}, fn = (h, g) => {
  const y = (f) => {
    const m = f.getData("text/html");
    if (!m) return null;
    const U = nn.parseFromString(m, "text/html").querySelectorAll("img");
    if (!U || !U.length) return null;
    const r = [...U].map((n) => n.src);
    return r.some((n) => tn.some((a) => n.includes(a))) ? null : r;
  }, i = async (f) => {
    for (let m = 0; m < f.length; m++) {
      const r = { imageSrc: f[m], id: ht() };
      await _t(r, g);
    }
  }, e = y(h);
  if (e && e.length) return i(e);
  const c = ((f) => {
    const m = f.items, U = [];
    for (let r = 0; r < m.length; r++) {
      const o = m[r];
      if (!St(o)) continue;
      const n = o.getAsFile();
      n && U.push(n);
    }
    return U;
  })(h);
  if (c && c.length) return Mt(c, g);
}, Tt = () => Te, Rt = (h) => {
  for (; Te.length; ) {
    const y = Te.pop();
    if (!y) continue;
    const i = fe(`#${y.id}`, h);
    Ve(i);
  }
  const g = fe("#ci-chat-upload-area", h);
  Je(g, "hidden");
}, cn = () => Re(`<a id="ci-upload-image" title="${Ae("uploadButtonTitle")}"><i class="fas fa-images"></i></a>`), ln = () => Re('<input type="file" multiple accept="image/*" id="ci-upload-image-hidden-input">'), un = (h, g, y) => {
  const i = (t) => {
    const c = t.currentTarget, f = c.files;
    f && (Mt(f, y), c.value = "");
  }, e = (t) => {
    t.preventDefault(), Dt(g, "click");
  };
  Pe(g, "change", i), Pe(h, "click", e);
}, dn = (h) => {
  if (!rt("uploadButton")) return;
  const g = fe(".control-buttons", h), y = cn(), i = ln();
  if (gt(!0)) {
    if (g[0])
      Je(g, "ci-control-buttons-gm"), _e(g, y), _e(g, i);
    else {
      const e = fe("#chat-controls", h), t = Re('<div class="ci-control-buttons-p"></div>');
      _e(t, y), _e(t, i), _e(e, t);
    }
    un(y, i, h);
  }
};
let ze = !1, $e = !1;
const hn = (h) => `<div class="ci-message-image"><img src="${h.imageSrc}" alt="${h.name || Ae("unableToLoadImage")}"></div>`, kt = (h) => `<div class="ci-message">${h.map((y) => hn(y)).join("")}</div>`, gn = (h) => (g, y, i) => {
  if ($e) return;
  ze = !0;
  const e = Tt();
  if (!e.length) {
    ze = !1;
    return;
  }
  const t = nt(h);
  t.on();
  const c = `${kt(e)}<div class="ci-notes">${g.content}</div>`;
  g.content = c, g._source.content = c, i.chatBubble = !1, Rt(h), ze = !1, t.off();
}, pn = (h) => async (g) => {
  if (ze || g.code !== "Enter" && g.code !== "NumpadEnter" || g.shiftKey) return;
  $e = !0;
  const y = nt(h), i = Tt();
  if (!i.length) {
    $e = !1;
    return;
  }
  y.on();
  const e = ke() ? CONST.CHAT_MESSAGE_STYLES.OOC : CONST.CHAT_MESSAGE_TYPES.OOC, t = {
    content: kt(i),
    type: typeof e < "u" ? e : 1,
    user: game.user
  };
  await ChatMessage.create(t), Rt(h), y.off(), $e = !1;
}, mn = (h) => (g) => {
  const y = g.originalEvent, i = y.clipboardData || y.dataTransfer;
  i && fn(i, h);
}, vn = (h) => !!fe("#ci-chat-upload-area", h).length, lt = (h) => {
  Hooks.on("preCreateChatMessage", gn(h)), Pe(h, "keyup", pn(h)), Pe(h, "paste drop", mn(h));
}, ut = (h) => {
  const g = fe(".ci-message-image img", h);
  if (!g[0]) return;
  Pe(g, "click", (i) => {
    const e = i.target.src, t = zt();
    ke() ? new t({ src: e, editable: !1, shareable: !0 }).render(!0) : new t(e, { editable: !1, shareable: !0 }).render(!0);
  });
}, dt = /!\s*ci\s*\|\s*(.+?)\s*!/gi, An = /\w+\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif)/gi, bn = (h) => `<div class="ci-message-image"><img src="${h}" alt="${Ae("unableToLoadImage")}"></div>`, wn = (h) => h.match(dt) ? h.replaceAll(dt, (g, y) => y.match(An) ? bn(y) : g) : h, yn = () => {
  Vt().forEach((g) => en(g));
};
Hooks.once("init", async () => {
  yn(), Un(), await It();
});
const Un = () => {
  if (ke()) {
    Hooks.on("renderChatMessageHTML", (g, y) => {
      const i = Re(y);
      fe(".ci-message-image", i)[0] && ut(i);
    });
    const h = (g) => {
      vn(g) || (at(g), lt(g));
    };
    Hooks.on("collapseSidebar", (g, y) => {
      if (!g || y) return;
      const i = g.element;
      if (!i || !i.querySelector("#chat-message")) return;
      const t = $(i);
      h(t);
    }), Hooks.on("activateChatLog", (g) => {
      if (!g) return;
      const y = g.element;
      if (!y || !y.querySelector("#chat-message")) return;
      const e = $(y);
      h(e);
    });
  } else
    Hooks.on("renderChatMessage", (h, g) => {
      fe(".ci-message-image", g)[0] && ut(g);
    }), Hooks.on("renderSidebarTab", (h, g) => {
      const y = g[0];
      !y || !y.querySelector("#chat-message") || (at(g), dn(g), lt(g));
    });
  Hooks.on("preCreateChatMessage", (h, g, y) => {
    const i = wn(h.content);
    h.content !== i && (h.content = i, h._source.content = i, y.chatBubble = !1);
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1pbWFnZXMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JpcHRzL3V0aWxzL0pxdWVyeVdyYXBwZXJzLnRzIiwiLi4vc3JjL3NjcmlwdHMvdXRpbHMvVXRpbHMudHMiLCIuLi9zcmMvc2NyaXB0cy9jb21wb25lbnRzL1VwbG9hZEFyZWEudHMiLCIuLi9ub2RlX21vZHVsZXMvYnJvd3Nlci1pbWFnZS1jb21wcmVzc2lvbi9kaXN0L2Jyb3dzZXItaW1hZ2UtY29tcHJlc3Npb24ubWpzIiwiLi4vc3JjL3NjcmlwdHMvY29tcG9uZW50cy9Mb2FkZXIudHMiLCIuLi9zcmMvc2NyaXB0cy91dGlscy9TZXR0aW5ncy50cyIsIi4uL3NyYy9zY3JpcHRzL3Byb2Nlc3NvcnMvRmlsZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9zY3JpcHRzL2NvbXBvbmVudHMvVXBsb2FkQnV0dG9uLnRzIiwiLi4vc3JjL3NjcmlwdHMvY29tcG9uZW50cy9DaGF0U2lkZWJhci50cyIsIi4uL3NyYy9zY3JpcHRzL2NvbXBvbmVudHMvQ2hhdE1lc3NhZ2UudHMiLCIuLi9zcmMvc2NyaXB0cy9wcm9jZXNzb3JzL01lc3NhZ2VQcm9jZXNzb3IudHMiLCIuLi9zcmMvY2hhdC1pbWFnZXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxyXG5leHBvcnQgY29uc3QgY3JlYXRlID0gKGh0bWw6IHN0cmluZyB8IEhUTUxFbGVtZW50KTogSlF1ZXJ5ID0+ICQoaHRtbClcclxuZXhwb3J0IGNvbnN0IGJlZm9yZSA9IChyZWZlcmVuY2VOb2RlOiBKUXVlcnksIG5ld05vZGU6IEpRdWVyeSk6IEpRdWVyeSA9PiByZWZlcmVuY2VOb2RlLmJlZm9yZShuZXdOb2RlKVxyXG5leHBvcnQgY29uc3QgYWZ0ZXIgPSAocmVmZXJlbmNlTm9kZTogSlF1ZXJ5LCBuZXdOb2RlOiBKUXVlcnkpOiBKUXVlcnkgPT4gcmVmZXJlbmNlTm9kZS5hZnRlcihuZXdOb2RlKVxyXG5leHBvcnQgY29uc3QgZmluZCA9IChzZWxlY3Rvcjogc3RyaW5nLCBwYXJlbnROb2RlPzogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHBhcmVudE5vZGUgPyBwYXJlbnROb2RlLmZpbmQoc2VsZWN0b3IpIDogJChzZWxlY3RvcilcclxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChwYXJlbnROb2RlOiBKUXVlcnksIG5ld05vZGU6IEpRdWVyeSk6IEpRdWVyeSA9PiBwYXJlbnROb2RlLmFwcGVuZChuZXdOb2RlKVxyXG4vLyBAdHMtaWdub3JlXHJcbmV4cG9ydCBjb25zdCBvbiA9IChwYXJlbnROb2RlOiBKUXVlcnksIGV2ZW50VHlwZTogc3RyaW5nLCBldmVudEZ1bmN0aW9uOiBGdW5jdGlvbik6IEpRdWVyeSA9PiBwYXJlbnROb2RlLm9uKGV2ZW50VHlwZSwgZXZlbnRGdW5jdGlvbilcclxuZXhwb3J0IGNvbnN0IHRyaWdnZXIgPSAocGFyZW50Tm9kZTogSlF1ZXJ5LCBldmVudFR5cGU6IHN0cmluZyk6IEpRdWVyeSA9PiBwYXJlbnROb2RlLnRyaWdnZXIoZXZlbnRUeXBlKVxyXG5leHBvcnQgY29uc3QgcmVtb3ZlQ2xhc3MgPSAocGFyZW50Tm9kZTogSlF1ZXJ5LCBjbGFzc1N0cmluZzogc3RyaW5nKTogSlF1ZXJ5ID0+IHBhcmVudE5vZGUucmVtb3ZlQ2xhc3MoY2xhc3NTdHJpbmcpXHJcbmV4cG9ydCBjb25zdCBhZGRDbGFzcyA9IChwYXJlbnROb2RlOiBKUXVlcnksIGNsYXNzU3RyaW5nOiBzdHJpbmcpOiBKUXVlcnkgPT4gcGFyZW50Tm9kZS5hZGRDbGFzcyhjbGFzc1N0cmluZylcclxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IChub2RlOiBKUXVlcnkpOiBKUXVlcnkgPT4gbm9kZS5yZW1vdmUoKVxyXG5leHBvcnQgY29uc3QgYXR0ciA9IChub2RlOiBKUXVlcnksIGF0dHJJZDogc3RyaW5nLCBhdHRyVmFsdWU/OiBhbnkpOiBzdHJpbmcgfCBKUXVlcnkgfCB1bmRlZmluZWQgPT4gYXR0clZhbHVlID8gbm9kZS5hdHRyKGF0dHJJZCwgYXR0clZhbHVlKSA6IG5vZGUuYXR0cihhdHRySWQpXHJcbmV4cG9ydCBjb25zdCByZW1vdmVBdHRyID0gKG5vZGU6IEpRdWVyeSwgYXR0cklkOiBzdHJpbmcpOiBKUXVlcnkgPT4gbm9kZS5yZW1vdmVBdHRyKGF0dHJJZClcclxuZXhwb3J0IGNvbnN0IGZvY3VzID0gKG5vZGU6IEpRdWVyeSk6IEpRdWVyeSA9PiBub2RlLmZvY3VzKClcclxuZXhwb3J0IGNvbnN0IHNjcm9sbEJvdHRvbSA9IChub2RlOiBKUXVlcnkpOiBKUXVlcnkgPT4gbm9kZS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBub2RlLmhlaWdodCgpIH0pXHJcbi8vIEB0cy1pZ25vcmVcclxuZXhwb3J0IGNvbnN0IGVhY2ggPSAobm9kZTogSlF1ZXJ5LCBoYW5kbGVyOiBGdW5jdGlvbik6IEpRdWVyeSA9PiBub2RlLmVhY2goaGFuZGxlcikiLCJleHBvcnQgY29uc3QgT1JJR0lOX0ZPTERFUiA9ICdkYXRhJ1xyXG5leHBvcnQgY29uc3QgdCA9ICh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcgPT4gKGdhbWUgYXMgR2FtZSk/LmkxOG4/LmxvY2FsaXplKGBDSS4ke3RleHR9YCkgfHwgJydcclxuZXhwb3J0IGNvbnN0IHJhbmRvbVN0cmluZyA9ICgpOiBzdHJpbmcgPT4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KSArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxNSlcclxuZXhwb3J0IGNvbnN0IHVzZXJDYW5VcGxvYWQgPSAoc2lsZW50ID0gZmFsc2UpOiBib29sZWFuID0+IHtcclxuICBjb25zdCB1c2VyUm9sZSA9IChnYW1lIGFzIEdhbWUpPy51c2VyPy5yb2xlXHJcbiAgY29uc3QgZmlsZVVwbG9hZFBlcm1pc3Npb25zID0gKGdhbWUgYXMgR2FtZSk/LnBlcm1pc3Npb25zPy5GSUxFU19VUExPQURcclxuXHJcbiAgaWYgKCF1c2VyUm9sZSB8fCAhZmlsZVVwbG9hZFBlcm1pc3Npb25zKSB7XHJcbiAgICBpZiAoIXNpbGVudCkgdWkubm90aWZpY2F0aW9ucz8ud2Fybih0KCd1cGxvYWRQZXJtaXNzaW9ucycpKVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICBjb25zdCB1cGxvYWRQZXJtaXNzaW9uID0gZmlsZVVwbG9hZFBlcm1pc3Npb25zLmluY2x1ZGVzKHVzZXJSb2xlKVxyXG4gIGlmICghdXBsb2FkUGVybWlzc2lvbiAmJiAhc2lsZW50KSB1aS5ub3RpZmljYXRpb25zPy53YXJuKHQoJ3VwbG9hZFBlcm1pc3Npb25zJykpXHJcblxyXG4gIHJldHVybiB1cGxvYWRQZXJtaXNzaW9uXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRGb3VuZHJ5VmVyc2lvbiA9ICgpID0+IChnYW1lIGFzIEdhbWUpPy52ZXJzaW9uXHJcblxyXG5leHBvcnQgY29uc3QgaXNWZXJpb3NuQWZ0ZXIxMyA9ICgpID0+IE51bWJlcihnZXRGb3VuZHJ5VmVyc2lvbigpKSA+PSAxM1xyXG5cclxuZXhwb3J0IGNvbnN0IEZpbGVQaWNrZXJJbXBsZW1lbnRhdGlvbiA9ICgpID0+IGlzVmVyaW9zbkFmdGVyMTMoKVxyXG4gID8gZm91bmRyeS5hcHBsaWNhdGlvbnMuYXBwcy5GaWxlUGlja2VyLmltcGxlbWVudGF0aW9uXHJcbiAgOiBGaWxlUGlja2VyXHJcblxyXG5leHBvcnQgY29uc3QgSW1hZ2VQb3BvdXRJbXBsZW1lbnRhdGlvbiA9ICgpID0+IGlzVmVyaW9zbkFmdGVyMTMoKVxyXG4gID8gZm91bmRyeS5hcHBsaWNhdGlvbnMuYXBwcy5JbWFnZVBvcG91dFxyXG4gIDogSW1hZ2VQb3BvdXQiLCJpbXBvcnQgeyBiZWZvcmUsIGNyZWF0ZSwgZmluZCB9IGZyb20gJy4uL3V0aWxzL0pxdWVyeVdyYXBwZXJzJ1xyXG5pbXBvcnQgeyBpc1Zlcmlvc25BZnRlcjEzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnXHJcblxyXG5jb25zdCBjcmVhdGVVcGxvYWRBcmVhID0gKCk6IEpRdWVyeSA9PiBjcmVhdGUoYDxkaXYgaWQ9XCJjaS1jaGF0LXVwbG9hZC1hcmVhXCIgY2xhc3M9XCJoaWRkZW5cIj48L2Rpdj5gKVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRVcGxvYWRBcmVhID0gKHNpZGViYXI6IEpRdWVyeSkgPT4ge1xyXG4gIGNvbnN0IGNoYXRDb250cm9sc1NlbGVjdG9yID0gaXNWZXJpb3NuQWZ0ZXIxMygpID8gJy5jaGF0LWNvbnRyb2xzJyA6ICcjY2hhdC1jb250cm9scydcclxuXHJcbiAgY29uc3QgY2hhdENvbnRyb2xzOiBKUXVlcnkgPSBmaW5kKGNoYXRDb250cm9sc1NlbGVjdG9yLCBzaWRlYmFyKVxyXG4gIGNvbnN0IHVwbG9hZEFyZWE6IEpRdWVyeSA9IGNyZWF0ZVVwbG9hZEFyZWEoKVxyXG4gIGJlZm9yZShjaGF0Q29udHJvbHMsIHVwbG9hZEFyZWEpXHJcbn1cclxuIiwiLyoqXG4gKiBCcm93c2VyIEltYWdlIENvbXByZXNzaW9uXG4gKiB2Mi4wLjJcbiAqIGJ5IERvbmFsZCA8ZG9uYWxkY3dsQGdtYWlsLmNvbT5cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Eb25hbGRjd2wvYnJvd3Nlci1pbWFnZS1jb21wcmVzc2lvblxuICovXG5cbmZ1bmN0aW9uIF9tZXJnZU5hbWVzcGFjZXMoZSx0KXtyZXR1cm4gdC5mb3JFYWNoKChmdW5jdGlvbih0KXt0JiZcInN0cmluZ1wiIT10eXBlb2YgdCYmIUFycmF5LmlzQXJyYXkodCkmJk9iamVjdC5rZXlzKHQpLmZvckVhY2goKGZ1bmN0aW9uKHIpe2lmKFwiZGVmYXVsdFwiIT09ciYmIShyIGluIGUpKXt2YXIgaT1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQscik7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUscixpLmdldD9pOntlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0W3JdfX0pfX0pKX0pKSxPYmplY3QuZnJlZXplKGUpfWZ1bmN0aW9uIGNvcHlFeGlmV2l0aG91dE9yaWVudGF0aW9uKGUsdCl7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihyLGkpe2xldCBvO3JldHVybiBnZXRBcHAxU2VnbWVudChlKS50aGVuKChmdW5jdGlvbihlKXt0cnl7cmV0dXJuIG89ZSxyKG5ldyBCbG9iKFt0LnNsaWNlKDAsMiksbyx0LnNsaWNlKDIpXSx7dHlwZTpcImltYWdlL2pwZWdcIn0pKX1jYXRjaChlKXtyZXR1cm4gaShlKX19KSxpKX0pKX1jb25zdCBnZXRBcHAxU2VnbWVudD1lPT5uZXcgUHJvbWlzZSgoKHQscik9Pntjb25zdCBpPW5ldyBGaWxlUmVhZGVyO2kuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwoKHt0YXJnZXQ6e3Jlc3VsdDplfX0pPT57Y29uc3QgaT1uZXcgRGF0YVZpZXcoZSk7bGV0IG89MDtpZig2NTQ5NiE9PWkuZ2V0VWludDE2KG8pKXJldHVybiByKFwibm90IGEgdmFsaWQgSlBFR1wiKTtmb3Iobys9Mjs7KXtjb25zdCBhPWkuZ2V0VWludDE2KG8pO2lmKDY1NDk4PT09YSlicmVhaztjb25zdCBzPWkuZ2V0VWludDE2KG8rMik7aWYoNjU1MDU9PT1hJiYxMTY1NTE5MjA2PT09aS5nZXRVaW50MzIobys0KSl7Y29uc3QgYT1vKzEwO2xldCBmO3N3aXRjaChpLmdldFVpbnQxNihhKSl7Y2FzZSAxODc2MTpmPSEwO2JyZWFrO2Nhc2UgMTk3ODk6Zj0hMTticmVhaztkZWZhdWx0OnJldHVybiByKFwiVElGRiBoZWFkZXIgY29udGFpbnMgaW52YWxpZCBlbmRpYW5cIil9aWYoNDIhPT1pLmdldFVpbnQxNihhKzIsZikpcmV0dXJuIHIoXCJUSUZGIGhlYWRlciBjb250YWlucyBpbnZhbGlkIHZlcnNpb25cIik7Y29uc3QgbD1pLmdldFVpbnQzMihhKzQsZiksYz1hK2wrMisxMippLmdldFVpbnQxNihhK2wsZik7Zm9yKGxldCBlPWErbCsyO2U8YztlKz0xMil7aWYoMjc0PT1pLmdldFVpbnQxNihlLGYpKXtpZigzIT09aS5nZXRVaW50MTYoZSsyLGYpKXJldHVybiByKFwiT3JpZW50YXRpb24gZGF0YSB0eXBlIGlzIGludmFsaWRcIik7aWYoMSE9PWkuZ2V0VWludDMyKGUrNCxmKSlyZXR1cm4gcihcIk9yaWVudGF0aW9uIGRhdGEgY291bnQgaXMgaW52YWxpZFwiKTtpLnNldFVpbnQxNihlKzgsMSxmKTticmVha319cmV0dXJuIHQoZS5zbGljZShvLG8rMitzKSl9bys9MitzfXJldHVybiB0KG5ldyBCbG9iKX0pKSxpLnJlYWRBc0FycmF5QnVmZmVyKGUpfSkpO3ZhciBlPXt9LHQ9e2dldCBleHBvcnRzKCl7cmV0dXJuIGV9LHNldCBleHBvcnRzKHQpe2U9dH19OyFmdW5jdGlvbihlKXt2YXIgcixpLFVaSVA9e307dC5leHBvcnRzPVVaSVAsVVpJUC5wYXJzZT1mdW5jdGlvbihlLHQpe2Zvcih2YXIgcj1VWklQLmJpbi5yZWFkVXNob3J0LGk9VVpJUC5iaW4ucmVhZFVpbnQsbz0wLGE9e30scz1uZXcgVWludDhBcnJheShlKSxmPXMubGVuZ3RoLTQ7MTAxMDEwMjU2IT1pKHMsZik7KWYtLTtvPWY7bys9NDt2YXIgbD1yKHMsbys9NCk7cihzLG8rPTIpO3ZhciBjPWkocyxvKz0yKSx1PWkocyxvKz00KTtvKz00LG89dTtmb3IodmFyIGg9MDtoPGw7aCsrKXtpKHMsbyksbys9NCxvKz00LG8rPTQsaShzLG8rPTQpO2M9aShzLG8rPTQpO3ZhciBkPWkocyxvKz00KSxBPXIocyxvKz00KSxnPXIocyxvKzIpLHA9cihzLG8rNCk7bys9Njt2YXIgbT1pKHMsbys9OCk7bys9NCxvKz1BK2crcCxVWklQLl9yZWFkTG9jYWwocyxtLGEsYyxkLHQpfXJldHVybiBhfSxVWklQLl9yZWFkTG9jYWw9ZnVuY3Rpb24oZSx0LHIsaSxvLGEpe3ZhciBzPVVaSVAuYmluLnJlYWRVc2hvcnQsZj1VWklQLmJpbi5yZWFkVWludDtmKGUsdCkscyhlLHQrPTQpLHMoZSx0Kz0yKTt2YXIgbD1zKGUsdCs9Mik7ZihlLHQrPTIpLGYoZSx0Kz00KSx0Kz00O3ZhciBjPXMoZSx0Kz04KSx1PXMoZSx0Kz0yKTt0Kz0yO3ZhciBoPVVaSVAuYmluLnJlYWRVVEY4KGUsdCxjKTtpZih0Kz1jLHQrPXUsYSlyW2hdPXtzaXplOm8sY3NpemU6aX07ZWxzZXt2YXIgZD1uZXcgVWludDhBcnJheShlLmJ1ZmZlcix0KTtpZigwPT1sKXJbaF09bmV3IFVpbnQ4QXJyYXkoZC5idWZmZXIuc2xpY2UodCx0K2kpKTtlbHNle2lmKDghPWwpdGhyb3dcInVua25vd24gY29tcHJlc3Npb24gbWV0aG9kOiBcIitsO3ZhciBBPW5ldyBVaW50OEFycmF5KG8pO1VaSVAuaW5mbGF0ZVJhdyhkLEEpLHJbaF09QX19fSxVWklQLmluZmxhdGVSYXc9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gVVpJUC5GLmluZmxhdGUoZSx0KX0sVVpJUC5pbmZsYXRlPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIGVbMF0sZVsxXSxVWklQLmluZmxhdGVSYXcobmV3IFVpbnQ4QXJyYXkoZS5idWZmZXIsZS5ieXRlT2Zmc2V0KzIsZS5sZW5ndGgtNiksdCl9LFVaSVAuZGVmbGF0ZT1mdW5jdGlvbihlLHQpe251bGw9PXQmJih0PXtsZXZlbDo2fSk7dmFyIHI9MCxpPW5ldyBVaW50OEFycmF5KDUwK01hdGguZmxvb3IoMS4xKmUubGVuZ3RoKSk7aVtyXT0xMjAsaVtyKzFdPTE1NixyKz0yLHI9VVpJUC5GLmRlZmxhdGVSYXcoZSxpLHIsdC5sZXZlbCk7dmFyIG89VVpJUC5hZGxlcihlLDAsZS5sZW5ndGgpO3JldHVybiBpW3IrMF09bz4+PjI0JjI1NSxpW3IrMV09bz4+PjE2JjI1NSxpW3IrMl09bz4+PjgmMjU1LGlbciszXT1vPj4+MCYyNTUsbmV3IFVpbnQ4QXJyYXkoaS5idWZmZXIsMCxyKzQpfSxVWklQLmRlZmxhdGVSYXc9ZnVuY3Rpb24oZSx0KXtudWxsPT10JiYodD17bGV2ZWw6Nn0pO3ZhciByPW5ldyBVaW50OEFycmF5KDUwK01hdGguZmxvb3IoMS4xKmUubGVuZ3RoKSksaT1VWklQLkYuZGVmbGF0ZVJhdyhlLHIsaSx0LmxldmVsKTtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoci5idWZmZXIsMCxpKX0sVVpJUC5lbmNvZGU9ZnVuY3Rpb24oZSx0KXtudWxsPT10JiYodD0hMSk7dmFyIHI9MCxpPVVaSVAuYmluLndyaXRlVWludCxvPVVaSVAuYmluLndyaXRlVXNob3J0LGE9e307Zm9yKHZhciBzIGluIGUpe3ZhciBmPSFVWklQLl9ub05lZWQocykmJiF0LGw9ZVtzXSxjPVVaSVAuY3JjLmNyYyhsLDAsbC5sZW5ndGgpO2Fbc109e2NwcjpmLHVzaXplOmwubGVuZ3RoLGNyYzpjLGZpbGU6Zj9VWklQLmRlZmxhdGVSYXcobCk6bH19Zm9yKHZhciBzIGluIGEpcis9YVtzXS5maWxlLmxlbmd0aCszMCs0NisyKlVaSVAuYmluLnNpemVVVEY4KHMpO3IrPTIyO3ZhciB1PW5ldyBVaW50OEFycmF5KHIpLGg9MCxkPVtdO2Zvcih2YXIgcyBpbiBhKXt2YXIgQT1hW3NdO2QucHVzaChoKSxoPVVaSVAuX3dyaXRlSGVhZGVyKHUsaCxzLEEsMCl9dmFyIGc9MCxwPWg7Zm9yKHZhciBzIGluIGEpe0E9YVtzXTtkLnB1c2goaCksaD1VWklQLl93cml0ZUhlYWRlcih1LGgscyxBLDEsZFtnKytdKX12YXIgbT1oLXA7cmV0dXJuIGkodSxoLDEwMTAxMDI1NiksaCs9NCxvKHUsaCs9NCxnKSxvKHUsaCs9MixnKSxpKHUsaCs9MixtKSxpKHUsaCs9NCxwKSxoKz00LGgrPTIsdS5idWZmZXJ9LFVaSVAuX25vTmVlZD1mdW5jdGlvbihlKXt2YXIgdD1lLnNwbGl0KFwiLlwiKS5wb3AoKS50b0xvd2VyQ2FzZSgpO3JldHVybi0xIT1cInBuZyxqcGcsanBlZyx6aXBcIi5pbmRleE9mKHQpfSxVWklQLl93cml0ZUhlYWRlcj1mdW5jdGlvbihlLHQscixpLG8sYSl7dmFyIHM9VVpJUC5iaW4ud3JpdGVVaW50LGY9VVpJUC5iaW4ud3JpdGVVc2hvcnQsbD1pLmZpbGU7cmV0dXJuIHMoZSx0LDA9PW8/NjczMjQ3NTI6MzM2MzkyNDgpLHQrPTQsMT09byYmKHQrPTIpLGYoZSx0LDIwKSxmKGUsdCs9MiwwKSxmKGUsdCs9MixpLmNwcj84OjApLHMoZSx0Kz0yLDApLHMoZSx0Kz00LGkuY3JjKSxzKGUsdCs9NCxsLmxlbmd0aCkscyhlLHQrPTQsaS51c2l6ZSksZihlLHQrPTQsVVpJUC5iaW4uc2l6ZVVURjgocikpLGYoZSx0Kz0yLDApLHQrPTIsMT09byYmKHQrPTIsdCs9MixzKGUsdCs9NixhKSx0Kz00KSx0Kz1VWklQLmJpbi53cml0ZVVURjgoZSx0LHIpLDA9PW8mJihlLnNldChsLHQpLHQrPWwubGVuZ3RoKSx0fSxVWklQLmNyYz17dGFibGU6ZnVuY3Rpb24oKXtmb3IodmFyIGU9bmV3IFVpbnQzMkFycmF5KDI1NiksdD0wO3Q8MjU2O3QrKyl7Zm9yKHZhciByPXQsaT0wO2k8ODtpKyspMSZyP3I9Mzk4ODI5MjM4NF5yPj4+MTpyPj4+PTE7ZVt0XT1yfXJldHVybiBlfSgpLHVwZGF0ZTpmdW5jdGlvbihlLHQscixpKXtmb3IodmFyIG89MDtvPGk7bysrKWU9VVpJUC5jcmMudGFibGVbMjU1JihlXnRbcitvXSldXmU+Pj44O3JldHVybiBlfSxjcmM6ZnVuY3Rpb24oZSx0LHIpe3JldHVybiA0Mjk0OTY3Mjk1XlVaSVAuY3JjLnVwZGF0ZSg0Mjk0OTY3Mjk1LGUsdCxyKX19LFVaSVAuYWRsZXI9ZnVuY3Rpb24oZSx0LHIpe2Zvcih2YXIgaT0xLG89MCxhPXQscz10K3I7YTxzOyl7Zm9yKHZhciBmPU1hdGgubWluKGErNTU1MixzKTthPGY7KW8rPWkrPWVbYSsrXTtpJT02NTUyMSxvJT02NTUyMX1yZXR1cm4gbzw8MTZ8aX0sVVpJUC5iaW49e3JlYWRVc2hvcnQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZVt0XXxlW3QrMV08PDh9LHdyaXRlVXNob3J0OmZ1bmN0aW9uKGUsdCxyKXtlW3RdPTI1NSZyLGVbdCsxXT1yPj44JjI1NX0scmVhZFVpbnQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gMTY3NzcyMTYqZVt0KzNdKyhlW3QrMl08PDE2fGVbdCsxXTw8OHxlW3RdKX0sd3JpdGVVaW50OmZ1bmN0aW9uKGUsdCxyKXtlW3RdPTI1NSZyLGVbdCsxXT1yPj44JjI1NSxlW3QrMl09cj4+MTYmMjU1LGVbdCszXT1yPj4yNCYyNTV9LHJlYWRBU0NJSTpmdW5jdGlvbihlLHQscil7Zm9yKHZhciBpPVwiXCIsbz0wO288cjtvKyspaSs9U3RyaW5nLmZyb21DaGFyQ29kZShlW3Qrb10pO3JldHVybiBpfSx3cml0ZUFTQ0lJOmZ1bmN0aW9uKGUsdCxyKXtmb3IodmFyIGk9MDtpPHIubGVuZ3RoO2krKyllW3QraV09ci5jaGFyQ29kZUF0KGkpfSxwYWQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGUubGVuZ3RoPDI/XCIwXCIrZTplfSxyZWFkVVRGODpmdW5jdGlvbihlLHQscil7Zm9yKHZhciBpLG89XCJcIixhPTA7YTxyO2ErKylvKz1cIiVcIitVWklQLmJpbi5wYWQoZVt0K2FdLnRvU3RyaW5nKDE2KSk7dHJ5e2k9ZGVjb2RlVVJJQ29tcG9uZW50KG8pfWNhdGNoKGkpe3JldHVybiBVWklQLmJpbi5yZWFkQVNDSUkoZSx0LHIpfXJldHVybiBpfSx3cml0ZVVURjg6ZnVuY3Rpb24oZSx0LHIpe2Zvcih2YXIgaT1yLmxlbmd0aCxvPTAsYT0wO2E8aTthKyspe3ZhciBzPXIuY2hhckNvZGVBdChhKTtpZigwPT0oNDI5NDk2NzE2OCZzKSllW3Qrb109cyxvKys7ZWxzZSBpZigwPT0oNDI5NDk2NTI0OCZzKSllW3Qrb109MTkyfHM+PjYsZVt0K28rMV09MTI4fHM+PjAmNjMsbys9MjtlbHNlIGlmKDA9PSg0Mjk0OTAxNzYwJnMpKWVbdCtvXT0yMjR8cz4+MTIsZVt0K28rMV09MTI4fHM+PjYmNjMsZVt0K28rMl09MTI4fHM+PjAmNjMsbys9MztlbHNle2lmKDAhPSg0MjkyODcwMTQ0JnMpKXRocm93XCJlXCI7ZVt0K29dPTI0MHxzPj4xOCxlW3QrbysxXT0xMjh8cz4+MTImNjMsZVt0K28rMl09MTI4fHM+PjYmNjMsZVt0K28rM109MTI4fHM+PjAmNjMsbys9NH19cmV0dXJuIG99LHNpemVVVEY4OmZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLmxlbmd0aCxyPTAsaT0wO2k8dDtpKyspe3ZhciBvPWUuY2hhckNvZGVBdChpKTtpZigwPT0oNDI5NDk2NzE2OCZvKSlyKys7ZWxzZSBpZigwPT0oNDI5NDk2NTI0OCZvKSlyKz0yO2Vsc2UgaWYoMD09KDQyOTQ5MDE3NjAmbykpcis9MztlbHNle2lmKDAhPSg0MjkyODcwMTQ0Jm8pKXRocm93XCJlXCI7cis9NH19cmV0dXJuIHJ9fSxVWklQLkY9e30sVVpJUC5GLmRlZmxhdGVSYXc9ZnVuY3Rpb24oZSx0LHIsaSl7dmFyIG89W1swLDAsMCwwLDBdLFs0LDQsOCw0LDBdLFs0LDUsMTYsOCwwXSxbNCw2LDE2LDE2LDBdLFs0LDEwLDE2LDMyLDBdLFs4LDE2LDMyLDMyLDBdLFs4LDE2LDEyOCwxMjgsMF0sWzgsMzIsMTI4LDI1NiwwXSxbMzIsMTI4LDI1OCwxMDI0LDFdLFszMiwyNTgsMjU4LDQwOTYsMV1dW2ldLGE9VVpJUC5GLlUscz1VWklQLkYuX2dvb2RJbmRleDtVWklQLkYuX2hhc2g7dmFyIGY9VVpJUC5GLl9wdXRzRSxsPTAsYz1yPDwzLHU9MCxoPWUubGVuZ3RoO2lmKDA9PWkpe2Zvcig7bDxoOyl7Zih0LGMsbCsoXz1NYXRoLm1pbig2NTUzNSxoLWwpKT09aD8xOjApLGM9VVpJUC5GLl9jb3B5RXhhY3QoZSxsLF8sdCxjKzgpLGwrPV99cmV0dXJuIGM+Pj4zfXZhciBkPWEubGl0cyxBPWEuc3RydCxnPWEucHJldixwPTAsbT0wLHc9MCx2PTAsYj0wLHk9MDtmb3IoaD4yJiYoQVt5PVVaSVAuRi5faGFzaChlLDApXT0wKSxsPTA7bDxoO2wrKyl7aWYoYj15LGwrMTxoLTIpe3k9VVpJUC5GLl9oYXNoKGUsbCsxKTt2YXIgRT1sKzEmMzI3Njc7Z1tFXT1BW3ldLEFbeV09RX1pZih1PD1sKXsocD4xNGUzfHxtPjI2Njk3KSYmaC1sPjEwMCYmKHU8bCYmKGRbcF09bC11LHArPTIsdT1sKSxjPVVaSVAuRi5fd3JpdGVCbG9jayhsPT1oLTF8fHU9PWg/MTowLGQscCx2LGUsdyxsLXcsdCxjKSxwPW09dj0wLHc9bCk7dmFyIEY9MDtsPGgtMiYmKEY9VVpJUC5GLl9iZXN0TWF0Y2goZSxsLGcsYixNYXRoLm1pbihvWzJdLGgtbCksb1szXSkpO3ZhciBfPUY+Pj4xNixCPTY1NTM1JkY7aWYoMCE9Ril7Qj02NTUzNSZGO3ZhciBVPXMoXz1GPj4+MTYsYS5vZjApO2EubGhzdFsyNTcrVV0rKzt2YXIgQz1zKEIsYS5kZjApO2EuZGhzdFtDXSsrLHYrPWEuZXhiW1VdK2EuZHhiW0NdLGRbcF09Xzw8MjN8bC11LGRbcCsxXT1CPDwxNnxVPDw4fEMscCs9Mix1PWwrX31lbHNlIGEubGhzdFtlW2xdXSsrO20rK319Zm9yKHc9PWwmJjAhPWUubGVuZ3RofHwodTxsJiYoZFtwXT1sLXUscCs9Mix1PWwpLGM9VVpJUC5GLl93cml0ZUJsb2NrKDEsZCxwLHYsZSx3LGwtdyx0LGMpLHA9MCxtPTAscD1tPXY9MCx3PWwpOzAhPSg3JmMpOyljKys7cmV0dXJuIGM+Pj4zfSxVWklQLkYuX2Jlc3RNYXRjaD1mdW5jdGlvbihlLHQscixpLG8sYSl7dmFyIHM9MzI3NjcmdCxmPXJbc10sbD1zLWYrMzI3NjgmMzI3Njc7aWYoZj09c3x8aSE9VVpJUC5GLl9oYXNoKGUsdC1sKSlyZXR1cm4gMDtmb3IodmFyIGM9MCx1PTAsaD1NYXRoLm1pbigzMjc2Nyx0KTtsPD1oJiYwIT0tLWEmJmYhPXM7KXtpZigwPT1jfHxlW3QrY109PWVbdCtjLWxdKXt2YXIgZD1VWklQLkYuX2hvd0xvbmcoZSx0LGwpO2lmKGQ+Yyl7aWYodT1sLChjPWQpPj1vKWJyZWFrO2wrMjxkJiYoZD1sKzIpO2Zvcih2YXIgQT0wLGc9MDtnPGQtMjtnKyspe3ZhciBwPXQtbCtnKzMyNzY4JjMyNzY3LG09cC1yW3BdKzMyNzY4JjMyNzY3O20+QSYmKEE9bSxmPXApfX19bCs9KHM9ZiktKGY9cltzXSkrMzI3NjgmMzI3Njd9cmV0dXJuIGM8PDE2fHV9LFVaSVAuRi5faG93TG9uZz1mdW5jdGlvbihlLHQscil7aWYoZVt0XSE9ZVt0LXJdfHxlW3QrMV0hPWVbdCsxLXJdfHxlW3QrMl0hPWVbdCsyLXJdKXJldHVybiAwO3ZhciBpPXQsbz1NYXRoLm1pbihlLmxlbmd0aCx0KzI1OCk7Zm9yKHQrPTM7dDxvJiZlW3RdPT1lW3Qtcl07KXQrKztyZXR1cm4gdC1pfSxVWklQLkYuX2hhc2g9ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZVt0XTw8OHxlW3QrMV0pKyhlW3QrMl08PDQpJjY1NTM1fSxVWklQLnNhdmVkPTAsVVpJUC5GLl93cml0ZUJsb2NrPWZ1bmN0aW9uKGUsdCxyLGksbyxhLHMsZixsKXt2YXIgYyx1LGgsZCxBLGcscCxtLHcsdj1VWklQLkYuVSxiPVVaSVAuRi5fcHV0c0YseT1VWklQLkYuX3B1dHNFO3YubGhzdFsyNTZdKyssdT0oYz1VWklQLkYuZ2V0VHJlZXMoKSlbMF0saD1jWzFdLGQ9Y1syXSxBPWNbM10sZz1jWzRdLHA9Y1s1XSxtPWNbNl0sdz1jWzddO3ZhciBFPTMyKygwPT0obCszJjcpPzA6OC0obCszJjcpKSsoczw8MyksRj1pK1VaSVAuRi5jb250U2l6ZSh2LmZsdHJlZSx2Lmxoc3QpK1VaSVAuRi5jb250U2l6ZSh2LmZkdHJlZSx2LmRoc3QpLF89aStVWklQLkYuY29udFNpemUodi5sdHJlZSx2Lmxoc3QpK1VaSVAuRi5jb250U2l6ZSh2LmR0cmVlLHYuZGhzdCk7Xys9MTQrMypwK1VaSVAuRi5jb250U2l6ZSh2Lml0cmVlLHYuaWhzdCkrKDIqdi5paHN0WzE2XSszKnYuaWhzdFsxN10rNyp2Lmloc3RbMThdKTtmb3IodmFyIEI9MDtCPDI4NjtCKyspdi5saHN0W0JdPTA7Zm9yKEI9MDtCPDMwO0IrKyl2LmRoc3RbQl09MDtmb3IoQj0wO0I8MTk7QisrKXYuaWhzdFtCXT0wO3ZhciBVPUU8RiYmRTxfPzA6RjxfPzE6MjtpZihiKGYsbCxlKSxiKGYsbCsxLFUpLGwrPTMsMD09VSl7Zm9yKDswIT0oNyZsKTspbCsrO2w9VVpJUC5GLl9jb3B5RXhhY3QobyxhLHMsZixsKX1lbHNle3ZhciBDLEk7aWYoMT09VSYmKEM9di5mbHRyZWUsST12LmZkdHJlZSksMj09VSl7VVpJUC5GLm1ha2VDb2Rlcyh2Lmx0cmVlLHUpLFVaSVAuRi5yZXZDb2Rlcyh2Lmx0cmVlLHUpLFVaSVAuRi5tYWtlQ29kZXModi5kdHJlZSxoKSxVWklQLkYucmV2Q29kZXModi5kdHJlZSxoKSxVWklQLkYubWFrZUNvZGVzKHYuaXRyZWUsZCksVVpJUC5GLnJldkNvZGVzKHYuaXRyZWUsZCksQz12Lmx0cmVlLEk9di5kdHJlZSx5KGYsbCxBLTI1NykseShmLGwrPTUsZy0xKSx5KGYsbCs9NSxwLTQpLGwrPTQ7Zm9yKHZhciBRPTA7UTxwO1ErKyl5KGYsbCszKlEsdi5pdHJlZVsxKyh2Lm9yZHJbUV08PDEpXSk7bCs9MypwLGw9VVpJUC5GLl9jb2RlVGlueShtLHYuaXRyZWUsZixsKSxsPVVaSVAuRi5fY29kZVRpbnkodyx2Lml0cmVlLGYsbCl9Zm9yKHZhciBNPWEseD0wO3g8cjt4Kz0yKXtmb3IodmFyIFM9dFt4XSxSPVM+Pj4yMyxUPU0rKDgzODg2MDcmUyk7TTxUOylsPVVaSVAuRi5fd3JpdGVMaXQob1tNKytdLEMsZixsKTtpZigwIT1SKXt2YXIgTz10W3grMV0sUD1PPj4xNixIPU8+PjgmMjU1LEw9MjU1Jk87eShmLGw9VVpJUC5GLl93cml0ZUxpdCgyNTcrSCxDLGYsbCksUi12Lm9mMFtIXSksbCs9di5leGJbSF0sYihmLGw9VVpJUC5GLl93cml0ZUxpdChMLEksZixsKSxQLXYuZGYwW0xdKSxsKz12LmR4YltMXSxNKz1SfX1sPVVaSVAuRi5fd3JpdGVMaXQoMjU2LEMsZixsKX1yZXR1cm4gbH0sVVpJUC5GLl9jb3B5RXhhY3Q9ZnVuY3Rpb24oZSx0LHIsaSxvKXt2YXIgYT1vPj4+MztyZXR1cm4gaVthXT1yLGlbYSsxXT1yPj4+OCxpW2ErMl09MjU1LWlbYV0saVthKzNdPTI1NS1pW2ErMV0sYSs9NCxpLnNldChuZXcgVWludDhBcnJheShlLmJ1ZmZlcix0LHIpLGEpLG8rKHIrNDw8Myl9LFVaSVAuRi5nZXRUcmVlcz1mdW5jdGlvbigpe2Zvcih2YXIgZT1VWklQLkYuVSx0PVVaSVAuRi5faHVmVHJlZShlLmxoc3QsZS5sdHJlZSwxNSkscj1VWklQLkYuX2h1ZlRyZWUoZS5kaHN0LGUuZHRyZWUsMTUpLGk9W10sbz1VWklQLkYuX2xlbkNvZGVzKGUubHRyZWUsaSksYT1bXSxzPVVaSVAuRi5fbGVuQ29kZXMoZS5kdHJlZSxhKSxmPTA7ZjxpLmxlbmd0aDtmKz0yKWUuaWhzdFtpW2ZdXSsrO2ZvcihmPTA7ZjxhLmxlbmd0aDtmKz0yKWUuaWhzdFthW2ZdXSsrO2Zvcih2YXIgbD1VWklQLkYuX2h1ZlRyZWUoZS5paHN0LGUuaXRyZWUsNyksYz0xOTtjPjQmJjA9PWUuaXRyZWVbMSsoZS5vcmRyW2MtMV08PDEpXTspYy0tO3JldHVyblt0LHIsbCxvLHMsYyxpLGFdfSxVWklQLkYuZ2V0U2Vjb25kPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1bXSxyPTA7cjxlLmxlbmd0aDtyKz0yKXQucHVzaChlW3IrMV0pO3JldHVybiB0fSxVWklQLkYubm9uWmVybz1mdW5jdGlvbihlKXtmb3IodmFyIHQ9XCJcIixyPTA7cjxlLmxlbmd0aDtyKz0yKTAhPWVbcisxXSYmKHQrPShyPj4xKStcIixcIik7cmV0dXJuIHR9LFVaSVAuRi5jb250U2l6ZT1mdW5jdGlvbihlLHQpe2Zvcih2YXIgcj0wLGk9MDtpPHQubGVuZ3RoO2krKylyKz10W2ldKmVbMSsoaTw8MSldO3JldHVybiByfSxVWklQLkYuX2NvZGVUaW55PWZ1bmN0aW9uKGUsdCxyLGkpe2Zvcih2YXIgbz0wO288ZS5sZW5ndGg7bys9Mil7dmFyIGE9ZVtvXSxzPWVbbysxXTtpPVVaSVAuRi5fd3JpdGVMaXQoYSx0LHIsaSk7dmFyIGY9MTY9PWE/MjoxNz09YT8zOjc7YT4xNSYmKFVaSVAuRi5fcHV0c0UocixpLHMsZiksaSs9Zil9cmV0dXJuIGl9LFVaSVAuRi5fbGVuQ29kZXM9ZnVuY3Rpb24oZSx0KXtmb3IodmFyIHI9ZS5sZW5ndGg7MiE9ciYmMD09ZVtyLTFdOylyLT0yO2Zvcih2YXIgaT0wO2k8cjtpKz0yKXt2YXIgbz1lW2krMV0sYT1pKzM8cj9lW2krM106LTEscz1pKzU8cj9lW2krNV06LTEsZj0wPT1pPy0xOmVbaS0xXTtpZigwPT1vJiZhPT1vJiZzPT1vKXtmb3IodmFyIGw9aSs1O2wrMjxyJiZlW2wrMl09PW87KWwrPTI7KGM9TWF0aC5taW4obCsxLWk+Pj4xLDEzOCkpPDExP3QucHVzaCgxNyxjLTMpOnQucHVzaCgxOCxjLTExKSxpKz0yKmMtMn1lbHNlIGlmKG89PWYmJmE9PW8mJnM9PW8pe2ZvcihsPWkrNTtsKzI8ciYmZVtsKzJdPT1vOylsKz0yO3ZhciBjPU1hdGgubWluKGwrMS1pPj4+MSw2KTt0LnB1c2goMTYsYy0zKSxpKz0yKmMtMn1lbHNlIHQucHVzaChvLDApfXJldHVybiByPj4+MX0sVVpJUC5GLl9odWZUcmVlPWZ1bmN0aW9uKGUsdCxyKXt2YXIgaT1bXSxvPWUubGVuZ3RoLGE9dC5sZW5ndGgscz0wO2ZvcihzPTA7czxhO3MrPTIpdFtzXT0wLHRbcysxXT0wO2ZvcihzPTA7czxvO3MrKykwIT1lW3NdJiZpLnB1c2goe2xpdDpzLGY6ZVtzXX0pO3ZhciBmPWkubGVuZ3RoLGw9aS5zbGljZSgwKTtpZigwPT1mKXJldHVybiAwO2lmKDE9PWYpe3ZhciBjPWlbMF0ubGl0O2w9MD09Yz8xOjA7cmV0dXJuIHRbMSsoYzw8MSldPTEsdFsxKyhsPDwxKV09MSwxfWkuc29ydCgoZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5mLXQuZn0pKTt2YXIgdT1pWzBdLGg9aVsxXSxkPTAsQT0xLGc9Mjtmb3IoaVswXT17bGl0Oi0xLGY6dS5mK2guZixsOnUscjpoLGQ6MH07QSE9Zi0xOyl1PWQhPUEmJihnPT1mfHxpW2RdLmY8aVtnXS5mKT9pW2QrK106aVtnKytdLGg9ZCE9QSYmKGc9PWZ8fGlbZF0uZjxpW2ddLmYpP2lbZCsrXTppW2crK10saVtBKytdPXtsaXQ6LTEsZjp1LmYraC5mLGw6dSxyOmh9O3ZhciBwPVVaSVAuRi5zZXREZXB0aChpW0EtMV0sMCk7Zm9yKHA+ciYmKFVaSVAuRi5yZXN0cmljdERlcHRoKGwscixwKSxwPXIpLHM9MDtzPGY7cysrKXRbMSsobFtzXS5saXQ8PDEpXT1sW3NdLmQ7cmV0dXJuIHB9LFVaSVAuRi5zZXREZXB0aD1mdW5jdGlvbihlLHQpe3JldHVybi0xIT1lLmxpdD8oZS5kPXQsdCk6TWF0aC5tYXgoVVpJUC5GLnNldERlcHRoKGUubCx0KzEpLFVaSVAuRi5zZXREZXB0aChlLnIsdCsxKSl9LFVaSVAuRi5yZXN0cmljdERlcHRoPWZ1bmN0aW9uKGUsdCxyKXt2YXIgaT0wLG89MTw8ci10LGE9MDtmb3IoZS5zb3J0KChmdW5jdGlvbihlLHQpe3JldHVybiB0LmQ9PWUuZD9lLmYtdC5mOnQuZC1lLmR9KSksaT0wO2k8ZS5sZW5ndGgmJmVbaV0uZD50O2krKyl7dmFyIHM9ZVtpXS5kO2VbaV0uZD10LGErPW8tKDE8PHItcyl9Zm9yKGE+Pj49ci10O2E+MDspeyhzPWVbaV0uZCk8dD8oZVtpXS5kKyssYS09MTw8dC1zLTEpOmkrK31mb3IoO2k+PTA7aS0tKWVbaV0uZD09dCYmYTwwJiYoZVtpXS5kLS0sYSsrKTswIT1hJiZjb25zb2xlLmxvZyhcImRlYnQgbGVmdFwiKX0sVVpJUC5GLl9nb29kSW5kZXg9ZnVuY3Rpb24oZSx0KXt2YXIgcj0wO3JldHVybiB0WzE2fHJdPD1lJiYocnw9MTYpLHRbOHxyXTw9ZSYmKHJ8PTgpLHRbNHxyXTw9ZSYmKHJ8PTQpLHRbMnxyXTw9ZSYmKHJ8PTIpLHRbMXxyXTw9ZSYmKHJ8PTEpLHJ9LFVaSVAuRi5fd3JpdGVMaXQ9ZnVuY3Rpb24oZSx0LHIsaSl7cmV0dXJuIFVaSVAuRi5fcHV0c0YocixpLHRbZTw8MV0pLGkrdFsxKyhlPDwxKV19LFVaSVAuRi5pbmZsYXRlPWZ1bmN0aW9uKGUsdCl7dmFyIHI9VWludDhBcnJheTtpZigzPT1lWzBdJiYwPT1lWzFdKXJldHVybiB0fHxuZXcgcigwKTt2YXIgaT1VWklQLkYsbz1pLl9iaXRzRixhPWkuX2JpdHNFLHM9aS5fZGVjb2RlVGlueSxmPWkubWFrZUNvZGVzLGw9aS5jb2RlczJtYXAsYz1pLl9nZXQxNyx1PWkuVSxoPW51bGw9PXQ7aCYmKHQ9bmV3IHIoZS5sZW5ndGg+Pj4yPDwzKSk7Zm9yKHZhciBkLEEsZz0wLHA9MCxtPTAsdz0wLHY9MCxiPTAseT0wLEU9MCxGPTA7MD09ZzspaWYoZz1vKGUsRiwxKSxwPW8oZSxGKzEsMiksRis9MywwIT1wKXtpZihoJiYodD1VWklQLkYuX2NoZWNrKHQsRSsoMTw8MTcpKSksMT09cCYmKGQ9dS5mbG1hcCxBPXUuZmRtYXAsYj01MTEseT0zMSksMj09cCl7bT1hKGUsRiw1KSsyNTcsdz1hKGUsRis1LDUpKzEsdj1hKGUsRisxMCw0KSs0LEYrPTE0O2Zvcih2YXIgXz0wO188Mzg7Xys9Mil1Lml0cmVlW19dPTAsdS5pdHJlZVtfKzFdPTA7dmFyIEI9MTtmb3IoXz0wO188djtfKyspe3ZhciBVPWEoZSxGKzMqXywzKTt1Lml0cmVlWzErKHUub3JkcltfXTw8MSldPVUsVT5CJiYoQj1VKX1GKz0zKnYsZih1Lml0cmVlLEIpLGwodS5pdHJlZSxCLHUuaW1hcCksZD11LmxtYXAsQT11LmRtYXAsRj1zKHUuaW1hcCwoMTw8QiktMSxtK3csZSxGLHUudHRyZWUpO3ZhciBDPWkuX2NvcHlPdXQodS50dHJlZSwwLG0sdS5sdHJlZSk7Yj0oMTw8QyktMTt2YXIgST1pLl9jb3B5T3V0KHUudHRyZWUsbSx3LHUuZHRyZWUpO3k9KDE8PEkpLTEsZih1Lmx0cmVlLEMpLGwodS5sdHJlZSxDLGQpLGYodS5kdHJlZSxJKSxsKHUuZHRyZWUsSSxBKX1mb3IoOzspe3ZhciBRPWRbYyhlLEYpJmJdO0YrPTE1JlE7dmFyIE09UT4+PjQ7aWYoTT4+Pjg9PTApdFtFKytdPU07ZWxzZXtpZigyNTY9PU0pYnJlYWs7dmFyIHg9RStNLTI1NDtpZihNPjI2NCl7dmFyIFM9dS5sZGVmW00tMjU3XTt4PUUrKFM+Pj4zKSthKGUsRiw3JlMpLEYrPTcmU312YXIgUj1BW2MoZSxGKSZ5XTtGKz0xNSZSO3ZhciBUPVI+Pj40LE89dS5kZGVmW1RdLFA9KE8+Pj40KStvKGUsRiwxNSZPKTtmb3IoRis9MTUmTyxoJiYodD1VWklQLkYuX2NoZWNrKHQsRSsoMTw8MTcpKSk7RTx4Oyl0W0VdPXRbRSsrLVBdLHRbRV09dFtFKystUF0sdFtFXT10W0UrKy1QXSx0W0VdPXRbRSsrLVBdO0U9eH19fWVsc2V7MCE9KDcmRikmJihGKz04LSg3JkYpKTt2YXIgSD00KyhGPj4+MyksTD1lW0gtNF18ZVtILTNdPDw4O2gmJih0PVVaSVAuRi5fY2hlY2sodCxFK0wpKSx0LnNldChuZXcgcihlLmJ1ZmZlcixlLmJ5dGVPZmZzZXQrSCxMKSxFKSxGPUgrTDw8MyxFKz1MfXJldHVybiB0Lmxlbmd0aD09RT90OnQuc2xpY2UoMCxFKX0sVVpJUC5GLl9jaGVjaz1mdW5jdGlvbihlLHQpe3ZhciByPWUubGVuZ3RoO2lmKHQ8PXIpcmV0dXJuIGU7dmFyIGk9bmV3IFVpbnQ4QXJyYXkoTWF0aC5tYXgocjw8MSx0KSk7cmV0dXJuIGkuc2V0KGUsMCksaX0sVVpJUC5GLl9kZWNvZGVUaW55PWZ1bmN0aW9uKGUsdCxyLGksbyxhKXtmb3IodmFyIHM9VVpJUC5GLl9iaXRzRSxmPVVaSVAuRi5fZ2V0MTcsbD0wO2w8cjspe3ZhciBjPWVbZihpLG8pJnRdO28rPTE1JmM7dmFyIHU9Yz4+PjQ7aWYodTw9MTUpYVtsXT11LGwrKztlbHNle3ZhciBoPTAsZD0wOzE2PT11PyhkPTMrcyhpLG8sMiksbys9MixoPWFbbC0xXSk6MTc9PXU/KGQ9MytzKGksbywzKSxvKz0zKToxOD09dSYmKGQ9MTErcyhpLG8sNyksbys9Nyk7Zm9yKHZhciBBPWwrZDtsPEE7KWFbbF09aCxsKyt9fXJldHVybiBvfSxVWklQLkYuX2NvcHlPdXQ9ZnVuY3Rpb24oZSx0LHIsaSl7Zm9yKHZhciBvPTAsYT0wLHM9aS5sZW5ndGg+Pj4xO2E8cjspe3ZhciBmPWVbYSt0XTtpW2E8PDFdPTAsaVsxKyhhPDwxKV09ZixmPm8mJihvPWYpLGErK31mb3IoO2E8czspaVthPDwxXT0wLGlbMSsoYTw8MSldPTAsYSsrO3JldHVybiBvfSxVWklQLkYubWFrZUNvZGVzPWZ1bmN0aW9uKGUsdCl7Zm9yKHZhciByLGksbyxhLHM9VVpJUC5GLlUsZj1lLmxlbmd0aCxsPXMuYmxfY291bnQsYz0wO2M8PXQ7YysrKWxbY109MDtmb3IoYz0xO2M8ZjtjKz0yKWxbZVtjXV0rKzt2YXIgdT1zLm5leHRfY29kZTtmb3Iocj0wLGxbMF09MCxpPTE7aTw9dDtpKyspcj1yK2xbaS0xXTw8MSx1W2ldPXI7Zm9yKG89MDtvPGY7bys9MikwIT0oYT1lW28rMV0pJiYoZVtvXT11W2FdLHVbYV0rKyl9LFVaSVAuRi5jb2RlczJtYXA9ZnVuY3Rpb24oZSx0LHIpe2Zvcih2YXIgaT1lLmxlbmd0aCxvPVVaSVAuRi5VLnJldjE1LGE9MDthPGk7YSs9MilpZigwIT1lW2ErMV0pZm9yKHZhciBzPWE+PjEsZj1lW2ErMV0sbD1zPDw0fGYsYz10LWYsdT1lW2FdPDxjLGg9dSsoMTw8Yyk7dSE9aDspe3Jbb1t1XT4+PjE1LXRdPWwsdSsrfX0sVVpJUC5GLnJldkNvZGVzPWZ1bmN0aW9uKGUsdCl7Zm9yKHZhciByPVVaSVAuRi5VLnJldjE1LGk9MTUtdCxvPTA7bzxlLmxlbmd0aDtvKz0yKXt2YXIgYT1lW29dPDx0LWVbbysxXTtlW29dPXJbYV0+Pj5pfX0sVVpJUC5GLl9wdXRzRT1mdW5jdGlvbihlLHQscil7cjw8PTcmdDt2YXIgaT10Pj4+MztlW2ldfD1yLGVbaSsxXXw9cj4+Pjh9LFVaSVAuRi5fcHV0c0Y9ZnVuY3Rpb24oZSx0LHIpe3I8PD03JnQ7dmFyIGk9dD4+PjM7ZVtpXXw9cixlW2krMV18PXI+Pj44LGVbaSsyXXw9cj4+PjE2fSxVWklQLkYuX2JpdHNFPWZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4KT4+Pig3JnQpJigxPDxyKS0xfSxVWklQLkYuX2JpdHNGPWZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4fGVbMisodD4+PjMpXTw8MTYpPj4+KDcmdCkmKDE8PHIpLTF9LFVaSVAuRi5fZ2V0MTc9ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4fGVbMisodD4+PjMpXTw8MTYpPj4+KDcmdCl9LFVaSVAuRi5fZ2V0MjU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4fGVbMisodD4+PjMpXTw8MTZ8ZVszKyh0Pj4+MyldPDwyNCk+Pj4oNyZ0KX0sVVpJUC5GLlU9KHI9VWludDE2QXJyYXksaT1VaW50MzJBcnJheSx7bmV4dF9jb2RlOm5ldyByKDE2KSxibF9jb3VudDpuZXcgcigxNiksb3JkcjpbMTYsMTcsMTgsMCw4LDcsOSw2LDEwLDUsMTEsNCwxMiwzLDEzLDIsMTQsMSwxNV0sb2YwOlszLDQsNSw2LDcsOCw5LDEwLDExLDEzLDE1LDE3LDE5LDIzLDI3LDMxLDM1LDQzLDUxLDU5LDY3LDgzLDk5LDExNSwxMzEsMTYzLDE5NSwyMjcsMjU4LDk5OSw5OTksOTk5XSxleGI6WzAsMCwwLDAsMCwwLDAsMCwxLDEsMSwxLDIsMiwyLDIsMywzLDMsMyw0LDQsNCw0LDUsNSw1LDUsMCwwLDAsMF0sbGRlZjpuZXcgcigzMiksZGYwOlsxLDIsMyw0LDUsNyw5LDEzLDE3LDI1LDMzLDQ5LDY1LDk3LDEyOSwxOTMsMjU3LDM4NSw1MTMsNzY5LDEwMjUsMTUzNywyMDQ5LDMwNzMsNDA5Nyw2MTQ1LDgxOTMsMTIyODksMTYzODUsMjQ1NzcsNjU1MzUsNjU1MzVdLGR4YjpbMCwwLDAsMCwxLDEsMiwyLDMsMyw0LDQsNSw1LDYsNiw3LDcsOCw4LDksOSwxMCwxMCwxMSwxMSwxMiwxMiwxMywxMywwLDBdLGRkZWY6bmV3IGkoMzIpLGZsbWFwOm5ldyByKDUxMiksZmx0cmVlOltdLGZkbWFwOm5ldyByKDMyKSxmZHRyZWU6W10sbG1hcDpuZXcgcigzMjc2OCksbHRyZWU6W10sdHRyZWU6W10sZG1hcDpuZXcgcigzMjc2OCksZHRyZWU6W10saW1hcDpuZXcgcig1MTIpLGl0cmVlOltdLHJldjE1Om5ldyByKDMyNzY4KSxsaHN0Om5ldyBpKDI4NiksZGhzdDpuZXcgaSgzMCksaWhzdDpuZXcgaSgxOSksbGl0czpuZXcgaSgxNWUzKSxzdHJ0Om5ldyByKDY1NTM2KSxwcmV2Om5ldyByKDMyNzY4KX0pLGZ1bmN0aW9uKCl7Zm9yKHZhciBlPVVaSVAuRi5VLHQ9MDt0PDMyNzY4O3QrKyl7dmFyIHI9dDtyPSg0Mjc4MjU1MzYwJihyPSg0MDQyMzIyMTYwJihyPSgzNDM1OTczODM2JihyPSgyODYzMzExNTMwJnIpPj4+MXwoMTQzMTY1NTc2NSZyKTw8MSkpPj4+MnwoODU4OTkzNDU5JnIpPDwyKSk+Pj40fCgyNTI2NDUxMzUmcik8PDQpKT4+Pjh8KDE2NzExOTM1JnIpPDw4LGUucmV2MTVbdF09KHI+Pj4xNnxyPDwxNik+Pj4xN31mdW5jdGlvbiBwdXNoVihlLHQscil7Zm9yKDswIT10LS07KWUucHVzaCgwLHIpfWZvcih0PTA7dDwzMjt0KyspZS5sZGVmW3RdPWUub2YwW3RdPDwzfGUuZXhiW3RdLGUuZGRlZlt0XT1lLmRmMFt0XTw8NHxlLmR4Ylt0XTtwdXNoVihlLmZsdHJlZSwxNDQsOCkscHVzaFYoZS5mbHRyZWUsMTEyLDkpLHB1c2hWKGUuZmx0cmVlLDI0LDcpLHB1c2hWKGUuZmx0cmVlLDgsOCksVVpJUC5GLm1ha2VDb2RlcyhlLmZsdHJlZSw5KSxVWklQLkYuY29kZXMybWFwKGUuZmx0cmVlLDksZS5mbG1hcCksVVpJUC5GLnJldkNvZGVzKGUuZmx0cmVlLDkpLHB1c2hWKGUuZmR0cmVlLDMyLDUpLFVaSVAuRi5tYWtlQ29kZXMoZS5mZHRyZWUsNSksVVpJUC5GLmNvZGVzMm1hcChlLmZkdHJlZSw1LGUuZmRtYXApLFVaSVAuRi5yZXZDb2RlcyhlLmZkdHJlZSw1KSxwdXNoVihlLml0cmVlLDE5LDApLHB1c2hWKGUubHRyZWUsMjg2LDApLHB1c2hWKGUuZHRyZWUsMzAsMCkscHVzaFYoZS50dHJlZSwzMjAsMCl9KCl9KCk7dmFyIFVaSVA9X21lcmdlTmFtZXNwYWNlcyh7X19wcm90b19fOm51bGwsZGVmYXVsdDplfSxbZV0pO2NvbnN0IFVQTkc9ZnVuY3Rpb24oKXt2YXIgZT17bmV4dFplcm8oZSx0KXtmb3IoOzAhPWVbdF07KXQrKztyZXR1cm4gdH0scmVhZFVzaG9ydDooZSx0KT0+ZVt0XTw8OHxlW3QrMV0sd3JpdGVVc2hvcnQoZSx0LHIpe2VbdF09cj4+OCYyNTUsZVt0KzFdPTI1NSZyfSxyZWFkVWludDooZSx0KT0+MTY3NzcyMTYqZVt0XSsoZVt0KzFdPDwxNnxlW3QrMl08PDh8ZVt0KzNdKSx3cml0ZVVpbnQoZSx0LHIpe2VbdF09cj4+MjQmMjU1LGVbdCsxXT1yPj4xNiYyNTUsZVt0KzJdPXI+PjgmMjU1LGVbdCszXT0yNTUmcn0scmVhZEFTQ0lJKGUsdCxyKXtsZXQgaT1cIlwiO2ZvcihsZXQgbz0wO288cjtvKyspaSs9U3RyaW5nLmZyb21DaGFyQ29kZShlW3Qrb10pO3JldHVybiBpfSx3cml0ZUFTQ0lJKGUsdCxyKXtmb3IobGV0IGk9MDtpPHIubGVuZ3RoO2krKyllW3QraV09ci5jaGFyQ29kZUF0KGkpfSxyZWFkQnl0ZXMoZSx0LHIpe2NvbnN0IGk9W107Zm9yKGxldCBvPTA7bzxyO28rKylpLnB1c2goZVt0K29dKTtyZXR1cm4gaX0scGFkOmU9PmUubGVuZ3RoPDI/YDAke2V9YDplLHJlYWRVVEY4KHQscixpKXtsZXQgbyxhPVwiXCI7Zm9yKGxldCBvPTA7bzxpO28rKylhKz1gJSR7ZS5wYWQodFtyK29dLnRvU3RyaW5nKDE2KSl9YDt0cnl7bz1kZWNvZGVVUklDb21wb25lbnQoYSl9Y2F0Y2gobyl7cmV0dXJuIGUucmVhZEFTQ0lJKHQscixpKX1yZXR1cm4gb319O2Z1bmN0aW9uIGRlY29kZUltYWdlKHQscixpLG8pe2NvbnN0IGE9cippLHM9X2dldEJQUChvKSxmPU1hdGguY2VpbChyKnMvOCksbD1uZXcgVWludDhBcnJheSg0KmEpLGM9bmV3IFVpbnQzMkFycmF5KGwuYnVmZmVyKSx7Y3R5cGU6dX09byx7ZGVwdGg6aH09byxkPWUucmVhZFVzaG9ydDtpZig2PT11KXtjb25zdCBlPWE8PDI7aWYoOD09aClmb3IodmFyIEE9MDtBPGU7QSs9NClsW0FdPXRbQV0sbFtBKzFdPXRbQSsxXSxsW0ErMl09dFtBKzJdLGxbQSszXT10W0ErM107aWYoMTY9PWgpZm9yKEE9MDtBPGU7QSsrKWxbQV09dFtBPDwxXX1lbHNlIGlmKDI9PXUpe2NvbnN0IGU9by50YWJzLnRSTlM7aWYobnVsbD09ZSl7aWYoOD09aClmb3IoQT0wO0E8YTtBKyspe3ZhciBnPTMqQTtjW0FdPTI1NTw8MjR8dFtnKzJdPDwxNnx0W2crMV08PDh8dFtnXX1pZigxNj09aClmb3IoQT0wO0E8YTtBKyspe2c9NipBO2NbQV09MjU1PDwyNHx0W2crNF08PDE2fHRbZysyXTw8OHx0W2ddfX1lbHNle3ZhciBwPWVbMF07Y29uc3Qgcj1lWzFdLGk9ZVsyXTtpZig4PT1oKWZvcihBPTA7QTxhO0ErKyl7dmFyIG09QTw8MjtnPTMqQTtjW0FdPTI1NTw8MjR8dFtnKzJdPDwxNnx0W2crMV08PDh8dFtnXSx0W2ddPT1wJiZ0W2crMV09PXImJnRbZysyXT09aSYmKGxbbSszXT0wKX1pZigxNj09aClmb3IoQT0wO0E8YTtBKyspe209QTw8MixnPTYqQTtjW0FdPTI1NTw8MjR8dFtnKzRdPDwxNnx0W2crMl08PDh8dFtnXSxkKHQsZyk9PXAmJmQodCxnKzIpPT1yJiZkKHQsZys0KT09aSYmKGxbbSszXT0wKX19fWVsc2UgaWYoMz09dSl7Y29uc3QgZT1vLnRhYnMuUExURSxzPW8udGFicy50Uk5TLGM9cz9zLmxlbmd0aDowO2lmKDE9PWgpZm9yKHZhciB3PTA7dzxpO3crKyl7dmFyIHY9dypmLGI9dypyO2ZvcihBPTA7QTxyO0ErKyl7bT1iK0E8PDI7dmFyIHk9MyooRT10W3YrKEE+PjMpXT4+Ny0oKDcmQSk8PDApJjEpO2xbbV09ZVt5XSxsW20rMV09ZVt5KzFdLGxbbSsyXT1lW3krMl0sbFttKzNdPUU8Yz9zW0VdOjI1NX19aWYoMj09aClmb3Iodz0wO3c8aTt3KyspZm9yKHY9dypmLGI9dypyLEE9MDtBPHI7QSsrKXttPWIrQTw8Mix5PTMqKEU9dFt2KyhBPj4yKV0+PjYtKCgzJkEpPDwxKSYzKTtsW21dPWVbeV0sbFttKzFdPWVbeSsxXSxsW20rMl09ZVt5KzJdLGxbbSszXT1FPGM/c1tFXToyNTV9aWYoND09aClmb3Iodz0wO3c8aTt3KyspZm9yKHY9dypmLGI9dypyLEE9MDtBPHI7QSsrKXttPWIrQTw8Mix5PTMqKEU9dFt2KyhBPj4xKV0+PjQtKCgxJkEpPDwyKSYxNSk7bFttXT1lW3ldLGxbbSsxXT1lW3krMV0sbFttKzJdPWVbeSsyXSxsW20rM109RTxjP3NbRV06MjU1fWlmKDg9PWgpZm9yKEE9MDtBPGE7QSsrKXt2YXIgRTttPUE8PDIseT0zKihFPXRbQV0pO2xbbV09ZVt5XSxsW20rMV09ZVt5KzFdLGxbbSsyXT1lW3krMl0sbFttKzNdPUU8Yz9zW0VdOjI1NX19ZWxzZSBpZig0PT11KXtpZig4PT1oKWZvcihBPTA7QTxhO0ErKyl7bT1BPDwyO3ZhciBGPXRbXz1BPDwxXTtsW21dPUYsbFttKzFdPUYsbFttKzJdPUYsbFttKzNdPXRbXysxXX1pZigxNj09aClmb3IoQT0wO0E8YTtBKyspe3ZhciBfO209QTw8MixGPXRbXz1BPDwyXTtsW21dPUYsbFttKzFdPUYsbFttKzJdPUYsbFttKzNdPXRbXysyXX19ZWxzZSBpZigwPT11KWZvcihwPW8udGFicy50Uk5TP28udGFicy50Uk5TOi0xLHc9MDt3PGk7dysrKXtjb25zdCBlPXcqZixpPXcqcjtpZigxPT1oKWZvcih2YXIgQj0wO0I8cjtCKyspe3ZhciBVPShGPTI1NSoodFtlKyhCPj4+MyldPj4+Ny0oNyZCKSYxKSk9PTI1NSpwPzA6MjU1O2NbaStCXT1VPDwyNHxGPDwxNnxGPDw4fEZ9ZWxzZSBpZigyPT1oKWZvcihCPTA7QjxyO0IrKyl7VT0oRj04NSoodFtlKyhCPj4+MildPj4+Ni0oKDMmQik8PDEpJjMpKT09ODUqcD8wOjI1NTtjW2krQl09VTw8MjR8Rjw8MTZ8Rjw8OHxGfWVsc2UgaWYoND09aClmb3IoQj0wO0I8cjtCKyspe1U9KEY9MTcqKHRbZSsoQj4+PjEpXT4+PjQtKCgxJkIpPDwyKSYxNSkpPT0xNypwPzA6MjU1O2NbaStCXT1VPDwyNHxGPDwxNnxGPDw4fEZ9ZWxzZSBpZig4PT1oKWZvcihCPTA7QjxyO0IrKyl7VT0oRj10W2UrQl0pPT1wPzA6MjU1O2NbaStCXT1VPDwyNHxGPDwxNnxGPDw4fEZ9ZWxzZSBpZigxNj09aClmb3IoQj0wO0I8cjtCKyspe0Y9dFtlKyhCPDwxKV0sVT1kKHQsZSsoQjw8MSkpPT1wPzA6MjU1O2NbaStCXT1VPDwyNHxGPDwxNnxGPDw4fEZ9fXJldHVybiBsfWZ1bmN0aW9uIF9kZWNvbXByZXNzKGUscixpLG8pe2NvbnN0IGE9X2dldEJQUChlKSxzPU1hdGguY2VpbChpKmEvOCksZj1uZXcgVWludDhBcnJheSgocysxK2UuaW50ZXJsYWNlKSpvKTtyZXR1cm4gcj1lLnRhYnMuQ2dCST90KHIsZik6X2luZmxhdGUocixmKSwwPT1lLmludGVybGFjZT9yPV9maWx0ZXJaZXJvKHIsZSwwLGksbyk6MT09ZS5pbnRlcmxhY2UmJihyPWZ1bmN0aW9uIF9yZWFkSW50ZXJsYWNlKGUsdCl7Y29uc3Qgcj10LndpZHRoLGk9dC5oZWlnaHQsbz1fZ2V0QlBQKHQpLGE9bz4+MyxzPU1hdGguY2VpbChyKm8vOCksZj1uZXcgVWludDhBcnJheShpKnMpO2xldCBsPTA7Y29uc3QgYz1bMCwwLDQsMCwyLDAsMV0sdT1bMCw0LDAsMiwwLDEsMF0saD1bOCw4LDgsNCw0LDIsMl0sZD1bOCw4LDQsNCwyLDIsMV07bGV0IEE9MDtmb3IoO0E8Nzspe2NvbnN0IHA9aFtBXSxtPWRbQV07bGV0IHc9MCx2PTAsYj1jW0FdO2Zvcig7YjxpOyliKz1wLHYrKztsZXQgeT11W0FdO2Zvcig7eTxyOyl5Kz1tLHcrKztjb25zdCBFPU1hdGguY2VpbCh3Km8vOCk7X2ZpbHRlclplcm8oZSx0LGwsdyx2KTtsZXQgRj0wLF89Y1tBXTtmb3IoO188aTspe2xldCB0PXVbQV0saT1sK0YqRTw8Mztmb3IoO3Q8cjspe3ZhciBnO2lmKDE9PW8pZz0oZz1lW2k+PjNdKT4+Ny0oNyZpKSYxLGZbXypzKyh0Pj4zKV18PWc8PDctKCg3JnQpPDwwKTtpZigyPT1vKWc9KGc9ZVtpPj4zXSk+PjYtKDcmaSkmMyxmW18qcysodD4+MildfD1nPDw2LSgoMyZ0KTw8MSk7aWYoND09bylnPShnPWVbaT4+M10pPj40LSg3JmkpJjE1LGZbXypzKyh0Pj4xKV18PWc8PDQtKCgxJnQpPDwyKTtpZihvPj04KXtjb25zdCByPV8qcyt0KmE7Zm9yKGxldCB0PTA7dDxhO3QrKylmW3IrdF09ZVsoaT4+MykrdF19aSs9byx0Kz1tfUYrKyxfKz1wfXcqdiE9MCYmKGwrPXYqKDErRSkpLEErPTF9cmV0dXJuIGZ9KHIsZSkpLHJ9ZnVuY3Rpb24gX2luZmxhdGUoZSxyKXtyZXR1cm4gdChuZXcgVWludDhBcnJheShlLmJ1ZmZlciwyLGUubGVuZ3RoLTYpLHIpfXZhciB0PWZ1bmN0aW9uKCl7Y29uc3QgZT17SDp7fX07cmV0dXJuIGUuSC5OPWZ1bmN0aW9uKHQscil7Y29uc3QgaT1VaW50OEFycmF5O2xldCBvLGEscz0wLGY9MCxsPTAsYz0wLHU9MCxoPTAsZD0wLEE9MCxnPTA7aWYoMz09dFswXSYmMD09dFsxXSlyZXR1cm4gcnx8bmV3IGkoMCk7Y29uc3QgcD1lLkgsbT1wLmIsdz1wLmUsdj1wLlIsYj1wLm4seT1wLkEsRT1wLlosRj1wLm0sXz1udWxsPT1yO2ZvcihfJiYocj1uZXcgaSh0Lmxlbmd0aD4+PjI8PDUpKTswPT1zOylpZihzPW0odCxnLDEpLGY9bSh0LGcrMSwyKSxnKz0zLDAhPWYpe2lmKF8mJihyPWUuSC5XKHIsQSsoMTw8MTcpKSksMT09ZiYmKG89Ri5KLGE9Ri5oLGg9NTExLGQ9MzEpLDI9PWYpe2w9dyh0LGcsNSkrMjU3LGM9dyh0LGcrNSw1KSsxLHU9dyh0LGcrMTAsNCkrNCxnKz0xNDtsZXQgZT0xO2Zvcih2YXIgQj0wO0I8Mzg7Qis9MilGLlFbQl09MCxGLlFbQisxXT0wO2ZvcihCPTA7Qjx1O0IrKyl7Y29uc3Qgcj13KHQsZyszKkIsMyk7Ri5RWzErKEYuWFtCXTw8MSldPXIscj5lJiYoZT1yKX1nKz0zKnUsYihGLlEsZSkseShGLlEsZSxGLnUpLG89Ri53LGE9Ri5kLGc9dihGLnUsKDE8PGUpLTEsbCtjLHQsZyxGLnYpO2NvbnN0IHI9cC5WKEYudiwwLGwsRi5DKTtoPSgxPDxyKS0xO2NvbnN0IGk9cC5WKEYudixsLGMsRi5EKTtkPSgxPDxpKS0xLGIoRi5DLHIpLHkoRi5DLHIsbyksYihGLkQsaSkseShGLkQsaSxhKX1mb3IoOzspe2NvbnN0IGU9b1tFKHQsZykmaF07Zys9MTUmZTtjb25zdCBpPWU+Pj40O2lmKGk+Pj44PT0wKXJbQSsrXT1pO2Vsc2V7aWYoMjU2PT1pKWJyZWFrO3tsZXQgZT1BK2ktMjU0O2lmKGk+MjY0KXtjb25zdCByPUYucVtpLTI1N107ZT1BKyhyPj4+Mykrdyh0LGcsNyZyKSxnKz03JnJ9Y29uc3Qgbz1hW0UodCxnKSZkXTtnKz0xNSZvO2NvbnN0IHM9bz4+PjQsZj1GLmNbc10sbD0oZj4+PjQpK20odCxnLDE1JmYpO2ZvcihnKz0xNSZmO0E8ZTspcltBXT1yW0ErKy1sXSxyW0FdPXJbQSsrLWxdLHJbQV09cltBKystbF0scltBXT1yW0ErKy1sXTtBPWV9fX19ZWxzZXswIT0oNyZnKSYmKGcrPTgtKDcmZykpO2NvbnN0IG89NCsoZz4+PjMpLGE9dFtvLTRdfHRbby0zXTw8ODtfJiYocj1lLkguVyhyLEErYSkpLHIuc2V0KG5ldyBpKHQuYnVmZmVyLHQuYnl0ZU9mZnNldCtvLGEpLEEpLGc9bythPDwzLEErPWF9cmV0dXJuIHIubGVuZ3RoPT1BP3I6ci5zbGljZSgwLEEpfSxlLkguVz1mdW5jdGlvbihlLHQpe2NvbnN0IHI9ZS5sZW5ndGg7aWYodDw9cilyZXR1cm4gZTtjb25zdCBpPW5ldyBVaW50OEFycmF5KHI8PDEpO3JldHVybiBpLnNldChlLDApLGl9LGUuSC5SPWZ1bmN0aW9uKHQscixpLG8sYSxzKXtjb25zdCBmPWUuSC5lLGw9ZS5ILlo7bGV0IGM9MDtmb3IoO2M8aTspe2NvbnN0IGU9dFtsKG8sYSkmcl07YSs9MTUmZTtjb25zdCBpPWU+Pj40O2lmKGk8PTE1KXNbY109aSxjKys7ZWxzZXtsZXQgZT0wLHQ9MDsxNj09aT8odD0zK2YobyxhLDIpLGErPTIsZT1zW2MtMV0pOjE3PT1pPyh0PTMrZihvLGEsMyksYSs9Myk6MTg9PWkmJih0PTExK2YobyxhLDcpLGErPTcpO2NvbnN0IHI9Yyt0O2Zvcig7YzxyOylzW2NdPWUsYysrfX1yZXR1cm4gYX0sZS5ILlY9ZnVuY3Rpb24oZSx0LHIsaSl7bGV0IG89MCxhPTA7Y29uc3Qgcz1pLmxlbmd0aD4+PjE7Zm9yKDthPHI7KXtjb25zdCByPWVbYSt0XTtpW2E8PDFdPTAsaVsxKyhhPDwxKV09cixyPm8mJihvPXIpLGErK31mb3IoO2E8czspaVthPDwxXT0wLGlbMSsoYTw8MSldPTAsYSsrO3JldHVybiBvfSxlLkgubj1mdW5jdGlvbih0LHIpe2NvbnN0IGk9ZS5ILm0sbz10Lmxlbmd0aDtsZXQgYSxzLGY7bGV0IGw7Y29uc3QgYz1pLmo7Zm9yKHZhciB1PTA7dTw9cjt1KyspY1t1XT0wO2Zvcih1PTE7dTxvO3UrPTIpY1t0W3VdXSsrO2NvbnN0IGg9aS5LO2ZvcihhPTAsY1swXT0wLHM9MTtzPD1yO3MrKylhPWErY1tzLTFdPDwxLGhbc109YTtmb3IoZj0wO2Y8bztmKz0yKWw9dFtmKzFdLDAhPWwmJih0W2ZdPWhbbF0saFtsXSsrKX0sZS5ILkE9ZnVuY3Rpb24odCxyLGkpe2NvbnN0IG89dC5sZW5ndGgsYT1lLkgubS5yO2ZvcihsZXQgZT0wO2U8bztlKz0yKWlmKDAhPXRbZSsxXSl7Y29uc3Qgbz1lPj4xLHM9dFtlKzFdLGY9bzw8NHxzLGw9ci1zO2xldCBjPXRbZV08PGw7Y29uc3QgdT1jKygxPDxsKTtmb3IoO2MhPXU7KXtpW2FbY10+Pj4xNS1yXT1mLGMrK319fSxlLkgubD1mdW5jdGlvbih0LHIpe2NvbnN0IGk9ZS5ILm0ucixvPTE1LXI7Zm9yKGxldCBlPTA7ZTx0Lmxlbmd0aDtlKz0yKXtjb25zdCBhPXRbZV08PHItdFtlKzFdO3RbZV09aVthXT4+Pm99fSxlLkguTT1mdW5jdGlvbihlLHQscil7cjw8PTcmdDtjb25zdCBpPXQ+Pj4zO2VbaV18PXIsZVtpKzFdfD1yPj4+OH0sZS5ILkk9ZnVuY3Rpb24oZSx0LHIpe3I8PD03JnQ7Y29uc3QgaT10Pj4+MztlW2ldfD1yLGVbaSsxXXw9cj4+PjgsZVtpKzJdfD1yPj4+MTZ9LGUuSC5lPWZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4KT4+Pig3JnQpJigxPDxyKS0xfSxlLkguYj1mdW5jdGlvbihlLHQscil7cmV0dXJuKGVbdD4+PjNdfGVbMSsodD4+PjMpXTw8OHxlWzIrKHQ+Pj4zKV08PDE2KT4+Pig3JnQpJigxPDxyKS0xfSxlLkguWj1mdW5jdGlvbihlLHQpe3JldHVybihlW3Q+Pj4zXXxlWzErKHQ+Pj4zKV08PDh8ZVsyKyh0Pj4+MyldPDwxNik+Pj4oNyZ0KX0sZS5ILmk9ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4fGVbMisodD4+PjMpXTw8MTZ8ZVszKyh0Pj4+MyldPDwyNCk+Pj4oNyZ0KX0sZS5ILm09ZnVuY3Rpb24oKXtjb25zdCBlPVVpbnQxNkFycmF5LHQ9VWludDMyQXJyYXk7cmV0dXJue0s6bmV3IGUoMTYpLGo6bmV3IGUoMTYpLFg6WzE2LDE3LDE4LDAsOCw3LDksNiwxMCw1LDExLDQsMTIsMywxMywyLDE0LDEsMTVdLFM6WzMsNCw1LDYsNyw4LDksMTAsMTEsMTMsMTUsMTcsMTksMjMsMjcsMzEsMzUsNDMsNTEsNTksNjcsODMsOTksMTE1LDEzMSwxNjMsMTk1LDIyNywyNTgsOTk5LDk5OSw5OTldLFQ6WzAsMCwwLDAsMCwwLDAsMCwxLDEsMSwxLDIsMiwyLDIsMywzLDMsMyw0LDQsNCw0LDUsNSw1LDUsMCwwLDAsMF0scTpuZXcgZSgzMikscDpbMSwyLDMsNCw1LDcsOSwxMywxNywyNSwzMyw0OSw2NSw5NywxMjksMTkzLDI1NywzODUsNTEzLDc2OSwxMDI1LDE1MzcsMjA0OSwzMDczLDQwOTcsNjE0NSw4MTkzLDEyMjg5LDE2Mzg1LDI0NTc3LDY1NTM1LDY1NTM1XSx6OlswLDAsMCwwLDEsMSwyLDIsMywzLDQsNCw1LDUsNiw2LDcsNyw4LDgsOSw5LDEwLDEwLDExLDExLDEyLDEyLDEzLDEzLDAsMF0sYzpuZXcgdCgzMiksSjpuZXcgZSg1MTIpLF86W10saDpuZXcgZSgzMiksJDpbXSx3Om5ldyBlKDMyNzY4KSxDOltdLHY6W10sZDpuZXcgZSgzMjc2OCksRDpbXSx1Om5ldyBlKDUxMiksUTpbXSxyOm5ldyBlKDMyNzY4KSxzOm5ldyB0KDI4NiksWTpuZXcgdCgzMCksYTpuZXcgdCgxOSksdDpuZXcgdCgxNWUzKSxrOm5ldyBlKDY1NTM2KSxnOm5ldyBlKDMyNzY4KX19KCksZnVuY3Rpb24oKXtjb25zdCB0PWUuSC5tO2Zvcih2YXIgcj0wO3I8MzI3Njg7cisrKXtsZXQgZT1yO2U9KDI4NjMzMTE1MzAmZSk+Pj4xfCgxNDMxNjU1NzY1JmUpPDwxLGU9KDM0MzU5NzM4MzYmZSk+Pj4yfCg4NTg5OTM0NTkmZSk8PDIsZT0oNDA0MjMyMjE2MCZlKT4+PjR8KDI1MjY0NTEzNSZlKTw8NCxlPSg0Mjc4MjU1MzYwJmUpPj4+OHwoMTY3MTE5MzUmZSk8PDgsdC5yW3JdPShlPj4+MTZ8ZTw8MTYpPj4+MTd9ZnVuY3Rpb24gbihlLHQscil7Zm9yKDswIT10LS07KWUucHVzaCgwLHIpfWZvcihyPTA7cjwzMjtyKyspdC5xW3JdPXQuU1tyXTw8M3x0LlRbcl0sdC5jW3JdPXQucFtyXTw8NHx0Lnpbcl07bih0Ll8sMTQ0LDgpLG4odC5fLDExMiw5KSxuKHQuXywyNCw3KSxuKHQuXyw4LDgpLGUuSC5uKHQuXyw5KSxlLkguQSh0Ll8sOSx0LkopLGUuSC5sKHQuXyw5KSxuKHQuJCwzMiw1KSxlLkgubih0LiQsNSksZS5ILkEodC4kLDUsdC5oKSxlLkgubCh0LiQsNSksbih0LlEsMTksMCksbih0LkMsMjg2LDApLG4odC5ELDMwLDApLG4odC52LDMyMCwwKX0oKSxlLkguTn0oKTtmdW5jdGlvbiBfZ2V0QlBQKGUpe3JldHVyblsxLG51bGwsMywxLDIsbnVsbCw0XVtlLmN0eXBlXSplLmRlcHRofWZ1bmN0aW9uIF9maWx0ZXJaZXJvKGUsdCxyLGksbyl7bGV0IGE9X2dldEJQUCh0KTtjb25zdCBzPU1hdGguY2VpbChpKmEvOCk7bGV0IGYsbDthPU1hdGguY2VpbChhLzgpO2xldCBjPWVbcl0sdT0wO2lmKGM+MSYmKGVbcl09WzAsMCwxXVtjLTJdKSwzPT1jKWZvcih1PWE7dTxzO3UrKyllW3UrMV09ZVt1KzFdKyhlW3UrMS1hXT4+PjEpJjI1NTtmb3IobGV0IHQ9MDt0PG87dCsrKWlmKGY9cit0KnMsbD1mK3QrMSxjPWVbbC0xXSx1PTAsMD09Yylmb3IoO3U8czt1KyspZVtmK3VdPWVbbCt1XTtlbHNlIGlmKDE9PWMpe2Zvcig7dTxhO3UrKyllW2YrdV09ZVtsK3VdO2Zvcig7dTxzO3UrKyllW2YrdV09ZVtsK3VdK2VbZit1LWFdfWVsc2UgaWYoMj09Yylmb3IoO3U8czt1KyspZVtmK3VdPWVbbCt1XStlW2YrdS1zXTtlbHNlIGlmKDM9PWMpe2Zvcig7dTxhO3UrKyllW2YrdV09ZVtsK3VdKyhlW2YrdS1zXT4+PjEpO2Zvcig7dTxzO3UrKyllW2YrdV09ZVtsK3VdKyhlW2YrdS1zXStlW2YrdS1hXT4+PjEpfWVsc2V7Zm9yKDt1PGE7dSsrKWVbZit1XT1lW2wrdV0rX3BhZXRoKDAsZVtmK3Utc10sMCk7Zm9yKDt1PHM7dSsrKWVbZit1XT1lW2wrdV0rX3BhZXRoKGVbZit1LWFdLGVbZit1LXNdLGVbZit1LWEtc10pfXJldHVybiBlfWZ1bmN0aW9uIF9wYWV0aChlLHQscil7Y29uc3QgaT1lK3QtcixvPWktZSxhPWktdCxzPWktcjtyZXR1cm4gbypvPD1hKmEmJm8qbzw9cypzP2U6YSphPD1zKnM/dDpyfWZ1bmN0aW9uIF9JSERSKHQscixpKXtpLndpZHRoPWUucmVhZFVpbnQodCxyKSxyKz00LGkuaGVpZ2h0PWUucmVhZFVpbnQodCxyKSxyKz00LGkuZGVwdGg9dFtyXSxyKyssaS5jdHlwZT10W3JdLHIrKyxpLmNvbXByZXNzPXRbcl0scisrLGkuZmlsdGVyPXRbcl0scisrLGkuaW50ZXJsYWNlPXRbcl0scisrfWZ1bmN0aW9uIF9jb3B5VGlsZShlLHQscixpLG8sYSxzLGYsbCl7Y29uc3QgYz1NYXRoLm1pbih0LG8pLHU9TWF0aC5taW4ocixhKTtsZXQgaD0wLGQ9MDtmb3IobGV0IHI9MDtyPHU7cisrKWZvcihsZXQgYT0wO2E8YzthKyspaWYocz49MCYmZj49MD8oaD1yKnQrYTw8MixkPShmK3IpKm8rcythPDwyKTooaD0oLWYrcikqdC1zK2E8PDIsZD1yKm8rYTw8MiksMD09bClpW2RdPWVbaF0saVtkKzFdPWVbaCsxXSxpW2QrMl09ZVtoKzJdLGlbZCszXT1lW2grM107ZWxzZSBpZigxPT1sKXt2YXIgQT1lW2grM10qKDEvMjU1KSxnPWVbaF0qQSxwPWVbaCsxXSpBLG09ZVtoKzJdKkEsdz1pW2QrM10qKDEvMjU1KSx2PWlbZF0qdyxiPWlbZCsxXSp3LHk9aVtkKzJdKnc7Y29uc3QgdD0xLUEscj1BK3cqdCxvPTA9PXI/MDoxL3I7aVtkKzNdPTI1NSpyLGlbZCswXT0oZyt2KnQpKm8saVtkKzFdPShwK2IqdCkqbyxpW2QrMl09KG0reSp0KSpvfWVsc2UgaWYoMj09bCl7QT1lW2grM10sZz1lW2hdLHA9ZVtoKzFdLG09ZVtoKzJdLHc9aVtkKzNdLHY9aVtkXSxiPWlbZCsxXSx5PWlbZCsyXTtBPT13JiZnPT12JiZwPT1iJiZtPT15PyhpW2RdPTAsaVtkKzFdPTAsaVtkKzJdPTAsaVtkKzNdPTApOihpW2RdPWcsaVtkKzFdPXAsaVtkKzJdPW0saVtkKzNdPUEpfWVsc2UgaWYoMz09bCl7QT1lW2grM10sZz1lW2hdLHA9ZVtoKzFdLG09ZVtoKzJdLHc9aVtkKzNdLHY9aVtkXSxiPWlbZCsxXSx5PWlbZCsyXTtpZihBPT13JiZnPT12JiZwPT1iJiZtPT15KWNvbnRpbnVlO2lmKEE8MjIwJiZ3PjIwKXJldHVybiExfXJldHVybiEwfXJldHVybntkZWNvZGU6ZnVuY3Rpb24gZGVjb2RlKHIpe2NvbnN0IGk9bmV3IFVpbnQ4QXJyYXkocik7bGV0IG89ODtjb25zdCBhPWUscz1hLnJlYWRVc2hvcnQsZj1hLnJlYWRVaW50LGw9e3RhYnM6e30sZnJhbWVzOltdfSxjPW5ldyBVaW50OEFycmF5KGkubGVuZ3RoKTtsZXQgdSxoPTAsZD0wO2NvbnN0IEE9WzEzNyw4MCw3OCw3MSwxMywxMCwyNiwxMF07Zm9yKHZhciBnPTA7Zzw4O2crKylpZihpW2ddIT1BW2ddKXRocm93XCJUaGUgaW5wdXQgaXMgbm90IGEgUE5HIGZpbGUhXCI7Zm9yKDtvPGkubGVuZ3RoOyl7Y29uc3QgZT1hLnJlYWRVaW50KGksbyk7bys9NDtjb25zdCByPWEucmVhZEFTQ0lJKGksbyw0KTtpZihvKz00LFwiSUhEUlwiPT1yKV9JSERSKGksbyxsKTtlbHNlIGlmKFwiaUNDUFwiPT1yKXtmb3IodmFyIHA9bzswIT1pW3BdOylwKys7YS5yZWFkQVNDSUkoaSxvLHAtbyksaVtwKzFdO2NvbnN0IHM9aS5zbGljZShwKzIsbytlKTtsZXQgZj1udWxsO3RyeXtmPV9pbmZsYXRlKHMpfWNhdGNoKGUpe2Y9dChzKX1sLnRhYnNbcl09Zn1lbHNlIGlmKFwiQ2dCSVwiPT1yKWwudGFic1tyXT1pLnNsaWNlKG8sbys0KTtlbHNlIGlmKFwiSURBVFwiPT1yKXtmb3IoZz0wO2c8ZTtnKyspY1toK2ddPWlbbytnXTtoKz1lfWVsc2UgaWYoXCJhY1RMXCI9PXIpbC50YWJzW3JdPXtudW1fZnJhbWVzOmYoaSxvKSxudW1fcGxheXM6ZihpLG8rNCl9LHU9bmV3IFVpbnQ4QXJyYXkoaS5sZW5ndGgpO2Vsc2UgaWYoXCJmY1RMXCI9PXIpe2lmKDAhPWQpKEU9bC5mcmFtZXNbbC5mcmFtZXMubGVuZ3RoLTFdKS5kYXRhPV9kZWNvbXByZXNzKGwsdS5zbGljZSgwLGQpLEUucmVjdC53aWR0aCxFLnJlY3QuaGVpZ2h0KSxkPTA7Y29uc3QgZT17eDpmKGksbysxMikseTpmKGksbysxNiksd2lkdGg6ZihpLG8rNCksaGVpZ2h0OmYoaSxvKzgpfTtsZXQgdD1zKGksbysyMik7dD1zKGksbysyMCkvKDA9PXQ/MTAwOnQpO2NvbnN0IHI9e3JlY3Q6ZSxkZWxheTpNYXRoLnJvdW5kKDFlMyp0KSxkaXNwb3NlOmlbbysyNF0sYmxlbmQ6aVtvKzI1XX07bC5mcmFtZXMucHVzaChyKX1lbHNlIGlmKFwiZmRBVFwiPT1yKXtmb3IoZz0wO2c8ZS00O2crKyl1W2QrZ109aVtvK2crNF07ZCs9ZS00fWVsc2UgaWYoXCJwSFlzXCI9PXIpbC50YWJzW3JdPVthLnJlYWRVaW50KGksbyksYS5yZWFkVWludChpLG8rNCksaVtvKzhdXTtlbHNlIGlmKFwiY0hSTVwiPT1yKXtsLnRhYnNbcl09W107Zm9yKGc9MDtnPDg7ZysrKWwudGFic1tyXS5wdXNoKGEucmVhZFVpbnQoaSxvKzQqZykpfWVsc2UgaWYoXCJ0RVh0XCI9PXJ8fFwielRYdFwiPT1yKXtudWxsPT1sLnRhYnNbcl0mJihsLnRhYnNbcl09e30pO3ZhciBtPWEubmV4dFplcm8oaSxvKSx3PWEucmVhZEFTQ0lJKGksbyxtLW8pLHY9bytlLW0tMTtpZihcInRFWHRcIj09cil5PWEucmVhZEFTQ0lJKGksbSsxLHYpO2Vsc2V7dmFyIGI9X2luZmxhdGUoaS5zbGljZShtKzIsbSsyK3YpKTt5PWEucmVhZFVURjgoYiwwLGIubGVuZ3RoKX1sLnRhYnNbcl1bd109eX1lbHNlIGlmKFwiaVRYdFwiPT1yKXtudWxsPT1sLnRhYnNbcl0mJihsLnRhYnNbcl09e30pO209MCxwPW87bT1hLm5leHRaZXJvKGkscCk7dz1hLnJlYWRBU0NJSShpLHAsbS1wKTtjb25zdCB0PWlbcD1tKzFdO3ZhciB5O2lbcCsxXSxwKz0yLG09YS5uZXh0WmVybyhpLHApLGEucmVhZEFTQ0lJKGkscCxtLXApLHA9bSsxLG09YS5uZXh0WmVybyhpLHApLGEucmVhZFVURjgoaSxwLG0tcCk7dj1lLSgocD1tKzEpLW8pO2lmKDA9PXQpeT1hLnJlYWRVVEY4KGkscCx2KTtlbHNle2I9X2luZmxhdGUoaS5zbGljZShwLHArdikpO3k9YS5yZWFkVVRGOChiLDAsYi5sZW5ndGgpfWwudGFic1tyXVt3XT15fWVsc2UgaWYoXCJQTFRFXCI9PXIpbC50YWJzW3JdPWEucmVhZEJ5dGVzKGksbyxlKTtlbHNlIGlmKFwiaElTVFwiPT1yKXtjb25zdCBlPWwudGFicy5QTFRFLmxlbmd0aC8zO2wudGFic1tyXT1bXTtmb3IoZz0wO2c8ZTtnKyspbC50YWJzW3JdLnB1c2gocyhpLG8rMipnKSl9ZWxzZSBpZihcInRSTlNcIj09cikzPT1sLmN0eXBlP2wudGFic1tyXT1hLnJlYWRCeXRlcyhpLG8sZSk6MD09bC5jdHlwZT9sLnRhYnNbcl09cyhpLG8pOjI9PWwuY3R5cGUmJihsLnRhYnNbcl09W3MoaSxvKSxzKGksbysyKSxzKGksbys0KV0pO2Vsc2UgaWYoXCJnQU1BXCI9PXIpbC50YWJzW3JdPWEucmVhZFVpbnQoaSxvKS8xZTU7ZWxzZSBpZihcInNSR0JcIj09cilsLnRhYnNbcl09aVtvXTtlbHNlIGlmKFwiYktHRFwiPT1yKTA9PWwuY3R5cGV8fDQ9PWwuY3R5cGU/bC50YWJzW3JdPVtzKGksbyldOjI9PWwuY3R5cGV8fDY9PWwuY3R5cGU/bC50YWJzW3JdPVtzKGksbykscyhpLG8rMikscyhpLG8rNCldOjM9PWwuY3R5cGUmJihsLnRhYnNbcl09aVtvXSk7ZWxzZSBpZihcIklFTkRcIj09cilicmVhaztvKz1lLGEucmVhZFVpbnQoaSxvKSxvKz00fXZhciBFO3JldHVybiAwIT1kJiYoKEU9bC5mcmFtZXNbbC5mcmFtZXMubGVuZ3RoLTFdKS5kYXRhPV9kZWNvbXByZXNzKGwsdS5zbGljZSgwLGQpLEUucmVjdC53aWR0aCxFLnJlY3QuaGVpZ2h0KSksbC5kYXRhPV9kZWNvbXByZXNzKGwsYyxsLndpZHRoLGwuaGVpZ2h0KSxkZWxldGUgbC5jb21wcmVzcyxkZWxldGUgbC5pbnRlcmxhY2UsZGVsZXRlIGwuZmlsdGVyLGx9LHRvUkdCQTg6ZnVuY3Rpb24gdG9SR0JBOChlKXtjb25zdCB0PWUud2lkdGgscj1lLmhlaWdodDtpZihudWxsPT1lLnRhYnMuYWNUTClyZXR1cm5bZGVjb2RlSW1hZ2UoZS5kYXRhLHQscixlKS5idWZmZXJdO2NvbnN0IGk9W107bnVsbD09ZS5mcmFtZXNbMF0uZGF0YSYmKGUuZnJhbWVzWzBdLmRhdGE9ZS5kYXRhKTtjb25zdCBvPXQqcio0LGE9bmV3IFVpbnQ4QXJyYXkobykscz1uZXcgVWludDhBcnJheShvKSxmPW5ldyBVaW50OEFycmF5KG8pO2ZvcihsZXQgYz0wO2M8ZS5mcmFtZXMubGVuZ3RoO2MrKyl7Y29uc3QgdT1lLmZyYW1lc1tjXSxoPXUucmVjdC54LGQ9dS5yZWN0LnksQT11LnJlY3Qud2lkdGgsZz11LnJlY3QuaGVpZ2h0LHA9ZGVjb2RlSW1hZ2UodS5kYXRhLEEsZyxlKTtpZigwIT1jKWZvcih2YXIgbD0wO2w8bztsKyspZltsXT1hW2xdO2lmKDA9PXUuYmxlbmQ/X2NvcHlUaWxlKHAsQSxnLGEsdCxyLGgsZCwwKToxPT11LmJsZW5kJiZfY29weVRpbGUocCxBLGcsYSx0LHIsaCxkLDEpLGkucHVzaChhLmJ1ZmZlci5zbGljZSgwKSksMD09dS5kaXNwb3NlKTtlbHNlIGlmKDE9PXUuZGlzcG9zZSlfY29weVRpbGUocyxBLGcsYSx0LHIsaCxkLDApO2Vsc2UgaWYoMj09dS5kaXNwb3NlKWZvcihsPTA7bDxvO2wrKylhW2xdPWZbbF19cmV0dXJuIGl9LF9wYWV0aDpfcGFldGgsX2NvcHlUaWxlOl9jb3B5VGlsZSxfYmluOmV9fSgpOyFmdW5jdGlvbigpe2NvbnN0e19jb3B5VGlsZTplfT1VUE5HLHtfYmluOnR9PVVQTkcscj1VUE5HLl9wYWV0aDt2YXIgaT17dGFibGU6ZnVuY3Rpb24oKXtjb25zdCBlPW5ldyBVaW50MzJBcnJheSgyNTYpO2ZvcihsZXQgdD0wO3Q8MjU2O3QrKyl7bGV0IHI9dDtmb3IobGV0IGU9MDtlPDg7ZSsrKTEmcj9yPTM5ODgyOTIzODRecj4+PjE6cj4+Pj0xO2VbdF09cn1yZXR1cm4gZX0oKSx1cGRhdGUoZSx0LHIsbyl7Zm9yKGxldCBhPTA7YTxvO2ErKyllPWkudGFibGVbMjU1JihlXnRbcithXSldXmU+Pj44O3JldHVybiBlfSxjcmM6KGUsdCxyKT0+NDI5NDk2NzI5NV5pLnVwZGF0ZSg0Mjk0OTY3Mjk1LGUsdCxyKX07ZnVuY3Rpb24gYWRkRXJyKGUsdCxyLGkpe3Rbcl0rPWVbMF0qaT4+NCx0W3IrMV0rPWVbMV0qaT4+NCx0W3IrMl0rPWVbMl0qaT4+NCx0W3IrM10rPWVbM10qaT4+NH1mdW5jdGlvbiBOKGUpe3JldHVybiBNYXRoLm1heCgwLE1hdGgubWluKDI1NSxlKSl9ZnVuY3Rpb24gRChlLHQpe2NvbnN0IHI9ZVswXS10WzBdLGk9ZVsxXS10WzFdLG89ZVsyXS10WzJdLGE9ZVszXS10WzNdO3JldHVybiByKnIraSppK28qbythKmF9ZnVuY3Rpb24gZGl0aGVyKGUsdCxyLGksbyxhLHMpe251bGw9PXMmJihzPTEpO2NvbnN0IGY9aS5sZW5ndGgsbD1bXTtmb3IodmFyIGM9MDtjPGY7YysrKXtjb25zdCBlPWlbY107bC5wdXNoKFtlPj4+MCYyNTUsZT4+PjgmMjU1LGU+Pj4xNiYyNTUsZT4+PjI0JjI1NV0pfWZvcihjPTA7YzxmO2MrKyl7bGV0IGU9NDI5NDk2NzI5NTtmb3IodmFyIHU9MCxoPTA7aDxmO2grKyl7dmFyIGQ9RChsW2NdLGxbaF0pO2ghPWMmJmQ8ZSYmKGU9ZCx1PWgpfX1jb25zdCBBPW5ldyBVaW50MzJBcnJheShvLmJ1ZmZlciksZz1uZXcgSW50MTZBcnJheSh0KnIqNCkscD1bMCw4LDIsMTAsMTIsNCwxNCw2LDMsMTEsMSw5LDE1LDcsMTMsNV07Zm9yKGM9MDtjPHAubGVuZ3RoO2MrKylwW2NdPTI1NSooKHBbY10rLjUpLzE2LS41KTtmb3IobGV0IG89MDtvPHI7bysrKWZvcihsZXQgdz0wO3c8dDt3Kyspe3ZhciBtO2M9NCoobyp0K3cpO2lmKDIhPXMpbT1bTihlW2NdK2dbY10pLE4oZVtjKzFdK2dbYysxXSksTihlW2MrMl0rZ1tjKzJdKSxOKGVbYyszXStnW2MrM10pXTtlbHNle2Q9cFs0KigzJm8pKygzJncpXTttPVtOKGVbY10rZCksTihlW2MrMV0rZCksTihlW2MrMl0rZCksTihlW2MrM10rZCldfXU9MDtsZXQgdj0xNjc3NzIxNTtmb3IoaD0wO2g8ZjtoKyspe2NvbnN0IGU9RChtLGxbaF0pO2U8diYmKHY9ZSx1PWgpfWNvbnN0IGI9bFt1XSx5PVttWzBdLWJbMF0sbVsxXS1iWzFdLG1bMl0tYlsyXSxtWzNdLWJbM11dOzE9PXMmJih3IT10LTEmJmFkZEVycih5LGcsYys0LDcpLG8hPXItMSYmKDAhPXcmJmFkZEVycih5LGcsYys0KnQtNCwzKSxhZGRFcnIoeSxnLGMrNCp0LDUpLHchPXQtMSYmYWRkRXJyKHksZyxjKzQqdCs0LDEpKSksYVtjPj4yXT11LEFbYz4+Ml09aVt1XX19ZnVuY3Rpb24gX21haW4oZSxyLG8sYSxzKXtudWxsPT1zJiYocz17fSk7Y29uc3R7Y3JjOmZ9PWksbD10LndyaXRlVWludCxjPXQud3JpdGVVc2hvcnQsdT10LndyaXRlQVNDSUk7bGV0IGg9ODtjb25zdCBkPWUuZnJhbWVzLmxlbmd0aD4xO2xldCBBLGc9ITEscD0zMysoZD8yMDowKTtpZihudWxsIT1zLnNSR0ImJihwKz0xMyksbnVsbCE9cy5wSFlzJiYocCs9MjEpLG51bGwhPXMuaUNDUCYmKEE9cGFrby5kZWZsYXRlKHMuaUNDUCkscCs9MjErQS5sZW5ndGgrNCksMz09ZS5jdHlwZSl7Zm9yKHZhciBtPWUucGx0ZS5sZW5ndGgsdz0wO3c8bTt3KyspZS5wbHRlW3ddPj4+MjQhPTI1NSYmKGc9ITApO3ArPTgrMyptKzQrKGc/OCsxKm0rNDowKX1mb3IodmFyIHY9MDt2PGUuZnJhbWVzLmxlbmd0aDt2Kyspe2QmJihwKz0zOCkscCs9KEY9ZS5mcmFtZXNbdl0pLmNpbWcubGVuZ3RoKzEyLDAhPXYmJihwKz00KX1wKz0xMjtjb25zdCBiPW5ldyBVaW50OEFycmF5KHApLHk9WzEzNyw4MCw3OCw3MSwxMywxMCwyNiwxMF07Zm9yKHc9MDt3PDg7dysrKWJbd109eVt3XTtpZihsKGIsaCwxMyksaCs9NCx1KGIsaCxcIklIRFJcIiksaCs9NCxsKGIsaCxyKSxoKz00LGwoYixoLG8pLGgrPTQsYltoXT1lLmRlcHRoLGgrKyxiW2hdPWUuY3R5cGUsaCsrLGJbaF09MCxoKyssYltoXT0wLGgrKyxiW2hdPTAsaCsrLGwoYixoLGYoYixoLTE3LDE3KSksaCs9NCxudWxsIT1zLnNSR0ImJihsKGIsaCwxKSxoKz00LHUoYixoLFwic1JHQlwiKSxoKz00LGJbaF09cy5zUkdCLGgrKyxsKGIsaCxmKGIsaC01LDUpKSxoKz00KSxudWxsIT1zLmlDQ1Ape2NvbnN0IGU9MTMrQS5sZW5ndGg7bChiLGgsZSksaCs9NCx1KGIsaCxcImlDQ1BcIiksaCs9NCx1KGIsaCxcIklDQyBwcm9maWxlXCIpLGgrPTExLGgrPTIsYi5zZXQoQSxoKSxoKz1BLmxlbmd0aCxsKGIsaCxmKGIsaC0oZSs0KSxlKzQpKSxoKz00fWlmKG51bGwhPXMucEhZcyYmKGwoYixoLDkpLGgrPTQsdShiLGgsXCJwSFlzXCIpLGgrPTQsbChiLGgscy5wSFlzWzBdKSxoKz00LGwoYixoLHMucEhZc1sxXSksaCs9NCxiW2hdPXMucEhZc1syXSxoKyssbChiLGgsZihiLGgtMTMsMTMpKSxoKz00KSxkJiYobChiLGgsOCksaCs9NCx1KGIsaCxcImFjVExcIiksaCs9NCxsKGIsaCxlLmZyYW1lcy5sZW5ndGgpLGgrPTQsbChiLGgsbnVsbCE9cy5sb29wP3MubG9vcDowKSxoKz00LGwoYixoLGYoYixoLTEyLDEyKSksaCs9NCksMz09ZS5jdHlwZSl7bChiLGgsMyoobT1lLnBsdGUubGVuZ3RoKSksaCs9NCx1KGIsaCxcIlBMVEVcIiksaCs9NDtmb3Iodz0wO3c8bTt3Kyspe2NvbnN0IHQ9Myp3LHI9ZS5wbHRlW3ddLGk9MjU1JnIsbz1yPj4+OCYyNTUsYT1yPj4+MTYmMjU1O2JbaCt0KzBdPWksYltoK3QrMV09byxiW2grdCsyXT1hfWlmKGgrPTMqbSxsKGIsaCxmKGIsaC0zKm0tNCwzKm0rNCkpLGgrPTQsZyl7bChiLGgsbSksaCs9NCx1KGIsaCxcInRSTlNcIiksaCs9NDtmb3Iodz0wO3c8bTt3KyspYltoK3ddPWUucGx0ZVt3XT4+PjI0JjI1NTtoKz1tLGwoYixoLGYoYixoLW0tNCxtKzQpKSxoKz00fX1sZXQgRT0wO2Zvcih2PTA7djxlLmZyYW1lcy5sZW5ndGg7disrKXt2YXIgRj1lLmZyYW1lc1t2XTtkJiYobChiLGgsMjYpLGgrPTQsdShiLGgsXCJmY1RMXCIpLGgrPTQsbChiLGgsRSsrKSxoKz00LGwoYixoLEYucmVjdC53aWR0aCksaCs9NCxsKGIsaCxGLnJlY3QuaGVpZ2h0KSxoKz00LGwoYixoLEYucmVjdC54KSxoKz00LGwoYixoLEYucmVjdC55KSxoKz00LGMoYixoLGFbdl0pLGgrPTIsYyhiLGgsMWUzKSxoKz0yLGJbaF09Ri5kaXNwb3NlLGgrKyxiW2hdPUYuYmxlbmQsaCsrLGwoYixoLGYoYixoLTMwLDMwKSksaCs9NCk7Y29uc3QgdD1GLmNpbWc7bChiLGgsKG09dC5sZW5ndGgpKygwPT12PzA6NCkpLGgrPTQ7Y29uc3Qgcj1oO3UoYixoLDA9PXY/XCJJREFUXCI6XCJmZEFUXCIpLGgrPTQsMCE9diYmKGwoYixoLEUrKyksaCs9NCksYi5zZXQodCxoKSxoKz1tLGwoYixoLGYoYixyLGgtcikpLGgrPTR9cmV0dXJuIGwoYixoLDApLGgrPTQsdShiLGgsXCJJRU5EXCIpLGgrPTQsbChiLGgsZihiLGgtNCw0KSksaCs9NCxiLmJ1ZmZlcn1mdW5jdGlvbiBjb21wcmVzc1BORyhlLHQscil7Zm9yKGxldCBpPTA7aTxlLmZyYW1lcy5sZW5ndGg7aSsrKXtjb25zdCBvPWUuZnJhbWVzW2ldO28ucmVjdC53aWR0aDtjb25zdCBhPW8ucmVjdC5oZWlnaHQscz1uZXcgVWludDhBcnJheShhKm8uYnBsK2EpO28uY2ltZz1fZmlsdGVyWmVybyhvLmltZyxhLG8uYnBwLG8uYnBsLHMsdCxyKX19ZnVuY3Rpb24gY29tcHJlc3ModCxyLGksbyxhKXtjb25zdCBzPWFbMF0sZj1hWzFdLGw9YVsyXSxjPWFbM10sdT1hWzRdLGg9YVs1XTtsZXQgZD02LEE9OCxnPTI1NTtmb3IodmFyIHA9MDtwPHQubGVuZ3RoO3ArKyl7Y29uc3QgZT1uZXcgVWludDhBcnJheSh0W3BdKTtmb3IodmFyIG09ZS5sZW5ndGgsdz0wO3c8bTt3Kz00KWcmPWVbdyszXX1jb25zdCB2PTI1NSE9ZyxiPWZ1bmN0aW9uIGZyYW1pemUodCxyLGksbyxhLHMpe2NvbnN0IGY9W107Zm9yKHZhciBsPTA7bDx0Lmxlbmd0aDtsKyspe2NvbnN0IGg9bmV3IFVpbnQ4QXJyYXkodFtsXSksQT1uZXcgVWludDMyQXJyYXkoaC5idWZmZXIpO3ZhciBjO2xldCBnPTAscD0wLG09cix3PWksdj1vPzE6MDtpZigwIT1sKXtjb25zdCBiPXN8fG98fDE9PWx8fDAhPWZbbC0yXS5kaXNwb3NlPzE6MjtsZXQgeT0wLEU9MWU5O2ZvcihsZXQgZT0wO2U8YjtlKyspe3ZhciB1PW5ldyBVaW50OEFycmF5KHRbbC0xLWVdKTtjb25zdCBvPW5ldyBVaW50MzJBcnJheSh0W2wtMS1lXSk7bGV0IHM9cixmPWksYz0tMSxoPS0xO2ZvcihsZXQgZT0wO2U8aTtlKyspZm9yKGxldCB0PTA7dDxyO3QrKyl7QVtkPWUqcit0XSE9b1tkXSYmKHQ8cyYmKHM9dCksdD5jJiYoYz10KSxlPGYmJihmPWUpLGU+aCYmKGg9ZSkpfS0xPT1jJiYocz1mPWM9aD0wKSxhJiYoMT09KDEmcykmJnMtLSwxPT0oMSZmKSYmZi0tKTtjb25zdCB2PShjLXMrMSkqKGgtZisxKTt2PEUmJihFPXYseT1lLGc9cyxwPWYsbT1jLXMrMSx3PWgtZisxKX11PW5ldyBVaW50OEFycmF5KHRbbC0xLXldKTsxPT15JiYoZltsLTFdLmRpc3Bvc2U9MiksYz1uZXcgVWludDhBcnJheShtKncqNCksZSh1LHIsaSxjLG0sdywtZywtcCwwKSx2PWUoaCxyLGksYyxtLHcsLWcsLXAsMyk/MTowLDE9PXY/X3ByZXBhcmVEaWZmKGgscixpLGMse3g6Zyx5OnAsd2lkdGg6bSxoZWlnaHQ6d30pOmUoaCxyLGksYyxtLHcsLWcsLXAsMCl9ZWxzZSBjPWguc2xpY2UoMCk7Zi5wdXNoKHtyZWN0Ont4OmcseTpwLHdpZHRoOm0saGVpZ2h0Ond9LGltZzpjLGJsZW5kOnYsZGlzcG9zZTowfSl9aWYobylmb3IobD0wO2w8Zi5sZW5ndGg7bCsrKXtpZigxPT0oQT1mW2xdKS5ibGVuZCljb250aW51ZTtjb25zdCBlPUEucmVjdCxvPWZbbC0xXS5yZWN0LHM9TWF0aC5taW4oZS54LG8ueCksYz1NYXRoLm1pbihlLnksby55KSx1PXt4OnMseTpjLHdpZHRoOk1hdGgubWF4KGUueCtlLndpZHRoLG8ueCtvLndpZHRoKS1zLGhlaWdodDpNYXRoLm1heChlLnkrZS5oZWlnaHQsby55K28uaGVpZ2h0KS1jfTtmW2wtMV0uZGlzcG9zZT0xLGwtMSE9MCYmX3VwZGF0ZUZyYW1lKHQscixpLGYsbC0xLHUsYSksX3VwZGF0ZUZyYW1lKHQscixpLGYsbCx1LGEpfWxldCBoPTA7aWYoMSE9dC5sZW5ndGgpZm9yKHZhciBkPTA7ZDxmLmxlbmd0aDtkKyspe3ZhciBBO2grPShBPWZbZF0pLnJlY3Qud2lkdGgqQS5yZWN0LmhlaWdodH1yZXR1cm4gZn0odCxyLGkscyxmLGwpLHk9e30sRT1bXSxGPVtdO2lmKDAhPW8pe2NvbnN0IGU9W107Zm9yKHc9MDt3PGIubGVuZ3RoO3crKyllLnB1c2goYlt3XS5pbWcuYnVmZmVyKTtjb25zdCB0PWZ1bmN0aW9uIGNvbmNhdFJHQkEoZSl7bGV0IHQ9MDtmb3IodmFyIHI9MDtyPGUubGVuZ3RoO3IrKyl0Kz1lW3JdLmJ5dGVMZW5ndGg7Y29uc3QgaT1uZXcgVWludDhBcnJheSh0KTtsZXQgbz0wO2ZvcihyPTA7cjxlLmxlbmd0aDtyKyspe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoZVtyXSksYT10Lmxlbmd0aDtmb3IobGV0IGU9MDtlPGE7ZSs9NCl7bGV0IHI9dFtlXSxhPXRbZSsxXSxzPXRbZSsyXTtjb25zdCBmPXRbZSszXTswPT1mJiYocj1hPXM9MCksaVtvK2VdPXIsaVtvK2UrMV09YSxpW28rZSsyXT1zLGlbbytlKzNdPWZ9bys9YX1yZXR1cm4gaS5idWZmZXJ9KGUpLHI9cXVhbnRpemUodCxvKTtmb3Iodz0wO3c8ci5wbHRlLmxlbmd0aDt3KyspRS5wdXNoKHIucGx0ZVt3XS5lc3QucmdiYSk7bGV0IGk9MDtmb3Iodz0wO3c8Yi5sZW5ndGg7dysrKXtjb25zdCBlPShCPWJbd10pLmltZy5sZW5ndGg7dmFyIF89bmV3IFVpbnQ4QXJyYXkoci5pbmRzLmJ1ZmZlcixpPj4yLGU+PjIpO0YucHVzaChfKTtjb25zdCB0PW5ldyBVaW50OEFycmF5KHIuYWJ1ZixpLGUpO2gmJmRpdGhlcihCLmltZyxCLnJlY3Qud2lkdGgsQi5yZWN0LmhlaWdodCxFLHQsXyksQi5pbWcuc2V0KHQpLGkrPWV9fWVsc2UgZm9yKHA9MDtwPGIubGVuZ3RoO3ArKyl7dmFyIEI9YltwXTtjb25zdCBlPW5ldyBVaW50MzJBcnJheShCLmltZy5idWZmZXIpO3ZhciBVPUIucmVjdC53aWR0aDttPWUubGVuZ3RoLF89bmV3IFVpbnQ4QXJyYXkobSk7Ri5wdXNoKF8pO2Zvcih3PTA7dzxtO3crKyl7Y29uc3QgdD1lW3ddO2lmKDAhPXcmJnQ9PWVbdy0xXSlfW3ddPV9bdy0xXTtlbHNlIGlmKHc+VSYmdD09ZVt3LVVdKV9bd109X1t3LVVdO2Vsc2V7bGV0IGU9eVt0XTtpZihudWxsPT1lJiYoeVt0XT1lPUUubGVuZ3RoLEUucHVzaCh0KSxFLmxlbmd0aD49MzAwKSlicmVhaztfW3ddPWV9fX1jb25zdCBDPUUubGVuZ3RoO0M8PTI1NiYmMD09dSYmKEE9Qzw9Mj8xOkM8PTQ/MjpDPD0xNj80OjgsQT1NYXRoLm1heChBLGMpKTtmb3IocD0wO3A8Yi5sZW5ndGg7cCsrKXsoQj1iW3BdKS5yZWN0LngsQi5yZWN0Lnk7VT1CLnJlY3Qud2lkdGg7Y29uc3QgZT1CLnJlY3QuaGVpZ2h0O2xldCB0PUIuaW1nO25ldyBVaW50MzJBcnJheSh0LmJ1ZmZlcik7bGV0IHI9NCpVLGk9NDtpZihDPD0yNTYmJjA9PXUpe3I9TWF0aC5jZWlsKEEqVS84KTt2YXIgST1uZXcgVWludDhBcnJheShyKmUpO2NvbnN0IG89RltwXTtmb3IobGV0IHQ9MDt0PGU7dCsrKXt3PXQqcjtjb25zdCBlPXQqVTtpZig4PT1BKWZvcih2YXIgUT0wO1E8VTtRKyspSVt3K1FdPW9bZStRXTtlbHNlIGlmKDQ9PUEpZm9yKFE9MDtRPFU7USsrKUlbdysoUT4+MSldfD1vW2UrUV08PDQtNCooMSZRKTtlbHNlIGlmKDI9PUEpZm9yKFE9MDtRPFU7USsrKUlbdysoUT4+MildfD1vW2UrUV08PDYtMiooMyZRKTtlbHNlIGlmKDE9PUEpZm9yKFE9MDtRPFU7USsrKUlbdysoUT4+MyldfD1vW2UrUV08PDctMSooNyZRKX10PUksZD0zLGk9MX1lbHNlIGlmKDA9PXYmJjE9PWIubGVuZ3RoKXtJPW5ldyBVaW50OEFycmF5KFUqZSozKTtjb25zdCBvPVUqZTtmb3Iodz0wO3c8bzt3Kyspe2NvbnN0IGU9Myp3LHI9NCp3O0lbZV09dFtyXSxJW2UrMV09dFtyKzFdLElbZSsyXT10W3IrMl19dD1JLGQ9MixpPTMscj0zKlV9Qi5pbWc9dCxCLmJwbD1yLEIuYnBwPWl9cmV0dXJue2N0eXBlOmQsZGVwdGg6QSxwbHRlOkUsZnJhbWVzOmJ9fWZ1bmN0aW9uIF91cGRhdGVGcmFtZSh0LHIsaSxvLGEscyxmKXtjb25zdCBsPVVpbnQ4QXJyYXksYz1VaW50MzJBcnJheSx1PW5ldyBsKHRbYS0xXSksaD1uZXcgYyh0W2EtMV0pLGQ9YSsxPHQubGVuZ3RoP25ldyBsKHRbYSsxXSk6bnVsbCxBPW5ldyBsKHRbYV0pLGc9bmV3IGMoQS5idWZmZXIpO2xldCBwPXIsbT1pLHc9LTEsdj0tMTtmb3IobGV0IGU9MDtlPHMuaGVpZ2h0O2UrKylmb3IobGV0IHQ9MDt0PHMud2lkdGg7dCsrKXtjb25zdCBpPXMueCt0LGY9cy55K2UsbD1mKnIraSxjPWdbbF07MD09Y3x8MD09b1thLTFdLmRpc3Bvc2UmJmhbbF09PWMmJihudWxsPT1kfHwwIT1kWzQqbCszXSl8fChpPHAmJihwPWkpLGk+dyYmKHc9aSksZjxtJiYobT1mKSxmPnYmJih2PWYpKX0tMT09dyYmKHA9bT13PXY9MCksZiYmKDE9PSgxJnApJiZwLS0sMT09KDEmbSkmJm0tLSkscz17eDpwLHk6bSx3aWR0aDp3LXArMSxoZWlnaHQ6di1tKzF9O2NvbnN0IGI9b1thXTtiLnJlY3Q9cyxiLmJsZW5kPTEsYi5pbWc9bmV3IFVpbnQ4QXJyYXkocy53aWR0aCpzLmhlaWdodCo0KSwwPT1vW2EtMV0uZGlzcG9zZT8oZSh1LHIsaSxiLmltZyxzLndpZHRoLHMuaGVpZ2h0LC1zLngsLXMueSwwKSxfcHJlcGFyZURpZmYoQSxyLGksYi5pbWcscykpOmUoQSxyLGksYi5pbWcscy53aWR0aCxzLmhlaWdodCwtcy54LC1zLnksMCl9ZnVuY3Rpb24gX3ByZXBhcmVEaWZmKHQscixpLG8sYSl7ZSh0LHIsaSxvLGEud2lkdGgsYS5oZWlnaHQsLWEueCwtYS55LDIpfWZ1bmN0aW9uIF9maWx0ZXJaZXJvKGUsdCxyLGksbyxhLHMpe2NvbnN0IGY9W107bGV0IGwsYz1bMCwxLDIsMyw0XTstMSE9YT9jPVthXToodCppPjVlNXx8MT09cikmJihjPVswXSkscyYmKGw9e2xldmVsOjB9KTtjb25zdCB1PVVaSVA7Zm9yKHZhciBoPTA7aDxjLmxlbmd0aDtoKyspe2ZvcihsZXQgYT0wO2E8dDthKyspX2ZpbHRlckxpbmUobyxlLGEsaSxyLGNbaF0pO2YucHVzaCh1LmRlZmxhdGUobyxsKSl9bGV0IGQsQT0xZTk7Zm9yKGg9MDtoPGYubGVuZ3RoO2grKylmW2hdLmxlbmd0aDxBJiYoZD1oLEE9ZltoXS5sZW5ndGgpO3JldHVybiBmW2RdfWZ1bmN0aW9uIF9maWx0ZXJMaW5lKGUsdCxpLG8sYSxzKXtjb25zdCBmPWkqbztsZXQgbD1mK2k7aWYoZVtsXT1zLGwrKywwPT1zKWlmKG88NTAwKWZvcih2YXIgYz0wO2M8bztjKyspZVtsK2NdPXRbZitjXTtlbHNlIGUuc2V0KG5ldyBVaW50OEFycmF5KHQuYnVmZmVyLGYsbyksbCk7ZWxzZSBpZigxPT1zKXtmb3IoYz0wO2M8YTtjKyspZVtsK2NdPXRbZitjXTtmb3IoYz1hO2M8bztjKyspZVtsK2NdPXRbZitjXS10W2YrYy1hXSsyNTYmMjU1fWVsc2UgaWYoMD09aSl7Zm9yKGM9MDtjPGE7YysrKWVbbCtjXT10W2YrY107aWYoMj09cylmb3IoYz1hO2M8bztjKyspZVtsK2NdPXRbZitjXTtpZigzPT1zKWZvcihjPWE7YzxvO2MrKyllW2wrY109dFtmK2NdLSh0W2YrYy1hXT4+MSkrMjU2JjI1NTtpZig0PT1zKWZvcihjPWE7YzxvO2MrKyllW2wrY109dFtmK2NdLXIodFtmK2MtYV0sMCwwKSsyNTYmMjU1fWVsc2V7aWYoMj09cylmb3IoYz0wO2M8bztjKyspZVtsK2NdPXRbZitjXSsyNTYtdFtmK2Mtb10mMjU1O2lmKDM9PXMpe2ZvcihjPTA7YzxhO2MrKyllW2wrY109dFtmK2NdKzI1Ni0odFtmK2Mtb10+PjEpJjI1NTtmb3IoYz1hO2M8bztjKyspZVtsK2NdPXRbZitjXSsyNTYtKHRbZitjLW9dK3RbZitjLWFdPj4xKSYyNTV9aWYoND09cyl7Zm9yKGM9MDtjPGE7YysrKWVbbCtjXT10W2YrY10rMjU2LXIoMCx0W2YrYy1vXSwwKSYyNTU7Zm9yKGM9YTtjPG87YysrKWVbbCtjXT10W2YrY10rMjU2LXIodFtmK2MtYV0sdFtmK2Mtb10sdFtmK2MtYS1vXSkmMjU1fX19ZnVuY3Rpb24gcXVhbnRpemUoZSx0KXtjb25zdCByPW5ldyBVaW50OEFycmF5KGUpLGk9ci5zbGljZSgwKSxvPW5ldyBVaW50MzJBcnJheShpLmJ1ZmZlciksYT1nZXRLRHRyZWUoaSx0KSxzPWFbMF0sZj1hWzFdLGw9ci5sZW5ndGgsYz1uZXcgVWludDhBcnJheShsPj4yKTtsZXQgdTtpZihyLmxlbmd0aDwyZTcpZm9yKHZhciBoPTA7aDxsO2grPTQpe3U9Z2V0TmVhcmVzdChzLGQ9cltoXSooMS8yNTUpLEE9cltoKzFdKigxLzI1NSksZz1yW2grMl0qKDEvMjU1KSxwPXJbaCszXSooMS8yNTUpKSxjW2g+PjJdPXUuaW5kLG9baD4+Ml09dS5lc3QucmdiYX1lbHNlIGZvcihoPTA7aDxsO2grPTQpe3ZhciBkPXJbaF0qKDEvMjU1KSxBPXJbaCsxXSooMS8yNTUpLGc9cltoKzJdKigxLzI1NSkscD1yW2grM10qKDEvMjU1KTtmb3IodT1zO3UubGVmdDspdT1wbGFuZURzdCh1LmVzdCxkLEEsZyxwKTw9MD91LmxlZnQ6dS5yaWdodDtjW2g+PjJdPXUuaW5kLG9baD4+Ml09dS5lc3QucmdiYX1yZXR1cm57YWJ1ZjppLmJ1ZmZlcixpbmRzOmMscGx0ZTpmfX1mdW5jdGlvbiBnZXRLRHRyZWUoZSx0LHIpe251bGw9PXImJihyPTFlLTQpO2NvbnN0IGk9bmV3IFVpbnQzMkFycmF5KGUuYnVmZmVyKSxvPXtpMDowLGkxOmUubGVuZ3RoLGJzdDpudWxsLGVzdDpudWxsLHRkc3Q6MCxsZWZ0Om51bGwscmlnaHQ6bnVsbH07by5ic3Q9c3RhdHMoZSxvLmkwLG8uaTEpLG8uZXN0PWVzdGF0cyhvLmJzdCk7Y29uc3QgYT1bb107Zm9yKDthLmxlbmd0aDx0Oyl7bGV0IHQ9MCxvPTA7Zm9yKHZhciBzPTA7czxhLmxlbmd0aDtzKyspYVtzXS5lc3QuTD50JiYodD1hW3NdLmVzdC5MLG89cyk7aWYodDxyKWJyZWFrO2NvbnN0IGY9YVtvXSxsPXNwbGl0UGl4ZWxzKGUsaSxmLmkwLGYuaTEsZi5lc3QuZSxmLmVzdC5lTXEyNTUpO2lmKGYuaTA+PWx8fGYuaTE8PWwpe2YuZXN0Lkw9MDtjb250aW51ZX1jb25zdCBjPXtpMDpmLmkwLGkxOmwsYnN0Om51bGwsZXN0Om51bGwsdGRzdDowLGxlZnQ6bnVsbCxyaWdodDpudWxsfTtjLmJzdD1zdGF0cyhlLGMuaTAsYy5pMSksYy5lc3Q9ZXN0YXRzKGMuYnN0KTtjb25zdCB1PXtpMDpsLGkxOmYuaTEsYnN0Om51bGwsZXN0Om51bGwsdGRzdDowLGxlZnQ6bnVsbCxyaWdodDpudWxsfTt1LmJzdD17UjpbXSxtOltdLE46Zi5ic3QuTi1jLmJzdC5OfTtmb3Iocz0wO3M8MTY7cysrKXUuYnN0LlJbc109Zi5ic3QuUltzXS1jLmJzdC5SW3NdO2ZvcihzPTA7czw0O3MrKyl1LmJzdC5tW3NdPWYuYnN0Lm1bc10tYy5ic3QubVtzXTt1LmVzdD1lc3RhdHModS5ic3QpLGYubGVmdD1jLGYucmlnaHQ9dSxhW29dPWMsYS5wdXNoKHUpfWEuc29ydCgoKGUsdCk9PnQuYnN0Lk4tZS5ic3QuTikpO2ZvcihzPTA7czxhLmxlbmd0aDtzKyspYVtzXS5pbmQ9cztyZXR1cm5bbyxhXX1mdW5jdGlvbiBnZXROZWFyZXN0KGUsdCxyLGksbyl7aWYobnVsbD09ZS5sZWZ0KXJldHVybiBlLnRkc3Q9ZnVuY3Rpb24gZGlzdChlLHQscixpLG8pe2NvbnN0IGE9dC1lWzBdLHM9ci1lWzFdLGY9aS1lWzJdLGw9by1lWzNdO3JldHVybiBhKmErcypzK2YqZitsKmx9KGUuZXN0LnEsdCxyLGksbyksZTtjb25zdCBhPXBsYW5lRHN0KGUuZXN0LHQscixpLG8pO2xldCBzPWUubGVmdCxmPWUucmlnaHQ7YT4wJiYocz1lLnJpZ2h0LGY9ZS5sZWZ0KTtjb25zdCBsPWdldE5lYXJlc3Qocyx0LHIsaSxvKTtpZihsLnRkc3Q8PWEqYSlyZXR1cm4gbDtjb25zdCBjPWdldE5lYXJlc3QoZix0LHIsaSxvKTtyZXR1cm4gYy50ZHN0PGwudGRzdD9jOmx9ZnVuY3Rpb24gcGxhbmVEc3QoZSx0LHIsaSxvKXtjb25zdHtlOmF9PWU7cmV0dXJuIGFbMF0qdCthWzFdKnIrYVsyXSppK2FbM10qby1lLmVNcX1mdW5jdGlvbiBzcGxpdFBpeGVscyhlLHQscixpLG8sYSl7Zm9yKGktPTQ7cjxpOyl7Zm9yKDt2ZWNEb3QoZSxyLG8pPD1hOylyKz00O2Zvcig7dmVjRG90KGUsaSxvKT5hOylpLT00O2lmKHI+PWkpYnJlYWs7Y29uc3Qgcz10W3I+PjJdO3Rbcj4+Ml09dFtpPj4yXSx0W2k+PjJdPXMscis9NCxpLT00fWZvcig7dmVjRG90KGUscixvKT5hOylyLT00O3JldHVybiByKzR9ZnVuY3Rpb24gdmVjRG90KGUsdCxyKXtyZXR1cm4gZVt0XSpyWzBdK2VbdCsxXSpyWzFdK2VbdCsyXSpyWzJdK2VbdCszXSpyWzNdfWZ1bmN0aW9uIHN0YXRzKGUsdCxyKXtjb25zdCBpPVswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwXSxvPVswLDAsMCwwXSxhPXItdD4+Mjtmb3IobGV0IGE9dDthPHI7YSs9NCl7Y29uc3QgdD1lW2FdKigxLzI1NSkscj1lW2ErMV0qKDEvMjU1KSxzPWVbYSsyXSooMS8yNTUpLGY9ZVthKzNdKigxLzI1NSk7b1swXSs9dCxvWzFdKz1yLG9bMl0rPXMsb1szXSs9ZixpWzBdKz10KnQsaVsxXSs9dCpyLGlbMl0rPXQqcyxpWzNdKz10KmYsaVs1XSs9cipyLGlbNl0rPXIqcyxpWzddKz1yKmYsaVsxMF0rPXMqcyxpWzExXSs9cypmLGlbMTVdKz1mKmZ9cmV0dXJuIGlbNF09aVsxXSxpWzhdPWlbMl0saVs5XT1pWzZdLGlbMTJdPWlbM10saVsxM109aVs3XSxpWzE0XT1pWzExXSx7UjppLG06byxOOmF9fWZ1bmN0aW9uIGVzdGF0cyhlKXtjb25zdHtSOnR9PWUse206cn09ZSx7TjppfT1lLGE9clswXSxzPXJbMV0sZj1yWzJdLGw9clszXSxjPTA9PWk/MDoxL2ksdT1bdFswXS1hKmEqYyx0WzFdLWEqcypjLHRbMl0tYSpmKmMsdFszXS1hKmwqYyx0WzRdLXMqYSpjLHRbNV0tcypzKmMsdFs2XS1zKmYqYyx0WzddLXMqbCpjLHRbOF0tZiphKmMsdFs5XS1mKnMqYyx0WzEwXS1mKmYqYyx0WzExXS1mKmwqYyx0WzEyXS1sKmEqYyx0WzEzXS1sKnMqYyx0WzE0XS1sKmYqYyx0WzE1XS1sKmwqY10saD11LGQ9bztsZXQgQT1bTWF0aC5yYW5kb20oKSxNYXRoLnJhbmRvbSgpLE1hdGgucmFuZG9tKCksTWF0aC5yYW5kb20oKV0sZz0wLHA9MDtpZigwIT1pKWZvcihsZXQgZT0wO2U8MTYmJihBPWQubXVsdFZlYyhoLEEpLHA9TWF0aC5zcXJ0KGQuZG90KEEsQSkpLEE9ZC5zbWwoMS9wLEEpLCEoMCE9ZSYmTWF0aC5hYnMocC1nKTwxZS05KSk7ZSsrKWc9cDtjb25zdCBtPVthKmMscypjLGYqYyxsKmNdO3JldHVybntDb3Y6dSxxOm0sZTpBLEw6ZyxlTXEyNTU6ZC5kb3QoZC5zbWwoMjU1LG0pLEEpLGVNcTpkLmRvdChBLG0pLHJnYmE6KE1hdGgucm91bmQoMjU1Km1bM10pPDwyNHxNYXRoLnJvdW5kKDI1NSptWzJdKTw8MTZ8TWF0aC5yb3VuZCgyNTUqbVsxXSk8PDh8TWF0aC5yb3VuZCgyNTUqbVswXSk8PDApPj4+MH19dmFyIG89e211bHRWZWM6KGUsdCk9PltlWzBdKnRbMF0rZVsxXSp0WzFdK2VbMl0qdFsyXStlWzNdKnRbM10sZVs0XSp0WzBdK2VbNV0qdFsxXStlWzZdKnRbMl0rZVs3XSp0WzNdLGVbOF0qdFswXStlWzldKnRbMV0rZVsxMF0qdFsyXStlWzExXSp0WzNdLGVbMTJdKnRbMF0rZVsxM10qdFsxXStlWzE0XSp0WzJdK2VbMTVdKnRbM11dLGRvdDooZSx0KT0+ZVswXSp0WzBdK2VbMV0qdFsxXStlWzJdKnRbMl0rZVszXSp0WzNdLHNtbDooZSx0KT0+W2UqdFswXSxlKnRbMV0sZSp0WzJdLGUqdFszXV19O1VQTkcuZW5jb2RlPWZ1bmN0aW9uIGVuY29kZShlLHQscixpLG8sYSxzKXtudWxsPT1pJiYoaT0wKSxudWxsPT1zJiYocz0hMSk7Y29uc3QgZj1jb21wcmVzcyhlLHQscixpLFshMSwhMSwhMSwwLHMsITFdKTtyZXR1cm4gY29tcHJlc3NQTkcoZiwtMSksX21haW4oZix0LHIsbyxhKX0sVVBORy5lbmNvZGVMTD1mdW5jdGlvbiBlbmNvZGVMTChlLHQscixpLG8sYSxzLGYpe2NvbnN0IGw9e2N0eXBlOjArKDE9PWk/MDoyKSsoMD09bz8wOjQpLGRlcHRoOmEsZnJhbWVzOltdfSxjPShpK28pKmEsdT1jKnQ7Zm9yKGxldCBpPTA7aTxlLmxlbmd0aDtpKyspbC5mcmFtZXMucHVzaCh7cmVjdDp7eDowLHk6MCx3aWR0aDp0LGhlaWdodDpyfSxpbWc6bmV3IFVpbnQ4QXJyYXkoZVtpXSksYmxlbmQ6MCxkaXNwb3NlOjEsYnBwOk1hdGguY2VpbChjLzgpLGJwbDpNYXRoLmNlaWwodS84KX0pO3JldHVybiBjb21wcmVzc1BORyhsLDAsITApLF9tYWluKGwsdCxyLHMsZil9LFVQTkcuZW5jb2RlLmNvbXByZXNzPWNvbXByZXNzLFVQTkcuZW5jb2RlLmRpdGhlcj1kaXRoZXIsVVBORy5xdWFudGl6ZT1xdWFudGl6ZSxVUE5HLnF1YW50aXplLmdldEtEdHJlZT1nZXRLRHRyZWUsVVBORy5xdWFudGl6ZS5nZXROZWFyZXN0PWdldE5lYXJlc3R9KCk7Y29uc3Qgcj17dG9BcnJheUJ1ZmZlcihlLHQpe2NvbnN0IGk9ZS53aWR0aCxvPWUuaGVpZ2h0LGE9aTw8MixzPWUuZ2V0Q29udGV4dChcIjJkXCIpLmdldEltYWdlRGF0YSgwLDAsaSxvKSxmPW5ldyBVaW50MzJBcnJheShzLmRhdGEuYnVmZmVyKSxsPSgzMippKzMxKS8zMjw8MixjPWwqbyx1PTEyMitjLGg9bmV3IEFycmF5QnVmZmVyKHUpLGQ9bmV3IERhdGFWaWV3KGgpLEE9MTw8MjA7bGV0IGcscCxtLHcsdj1BLGI9MCx5PTAsRT0wO2Z1bmN0aW9uIHNldDE2KGUpe2Quc2V0VWludDE2KHksZSwhMCkseSs9Mn1mdW5jdGlvbiBzZXQzMihlKXtkLnNldFVpbnQzMih5LGUsITApLHkrPTR9ZnVuY3Rpb24gc2VlayhlKXt5Kz1lfXNldDE2KDE5Nzc4KSxzZXQzMih1KSxzZWVrKDQpLHNldDMyKDEyMiksc2V0MzIoMTA4KSxzZXQzMihpKSxzZXQzMigtbz4+PjApLHNldDE2KDEpLHNldDE2KDMyKSxzZXQzMigzKSxzZXQzMihjKSxzZXQzMigyODM1KSxzZXQzMigyODM1KSxzZWVrKDgpLHNldDMyKDE2NzExNjgwKSxzZXQzMig2NTI4MCksc2V0MzIoMjU1KSxzZXQzMig0Mjc4MTkwMDgwKSxzZXQzMigxNDY2NTI3MjY0KSxmdW5jdGlvbiBjb252ZXJ0KCl7Zm9yKDtiPG8mJnY+MDspe2Zvcih3PTEyMitiKmwsZz0wO2c8YTspdi0tLHA9ZltFKytdLG09cD4+PjI0LGQuc2V0VWludDMyKHcrZyxwPDw4fG0pLGcrPTQ7YisrfUU8Zi5sZW5ndGg/KHY9QSxzZXRUaW1lb3V0KGNvbnZlcnQsci5fZGx5KSk6dChoKX0oKX0sdG9CbG9iKGUsdCl7dGhpcy50b0FycmF5QnVmZmVyKGUsKGU9Pnt0KG5ldyBCbG9iKFtlXSx7dHlwZTpcImltYWdlL2JtcFwifSkpfSkpfSxfZGx5Ojl9O3ZhciBpPXtDSFJPTUU6XCJDSFJPTUVcIixGSVJFRk9YOlwiRklSRUZPWFwiLERFU0tUT1BfU0FGQVJJOlwiREVTS1RPUF9TQUZBUklcIixJRTpcIklFXCIsSU9TOlwiSU9TXCIsRVRDOlwiRVRDXCJ9LG89e1tpLkNIUk9NRV06MTYzODQsW2kuRklSRUZPWF06MTExODAsW2kuREVTS1RPUF9TQUZBUkldOjE2Mzg0LFtpLklFXTo4MTkyLFtpLklPU106NDA5NixbaS5FVENdOjgxOTJ9O2NvbnN0IGE9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyxzPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSYmc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlLGY9YSYmd2luZG93LmNvcmRvdmEmJndpbmRvdy5jb3Jkb3ZhLnJlcXVpcmUmJndpbmRvdy5jb3Jkb3ZhLnJlcXVpcmUoXCJjb3Jkb3ZhL21vZHVsZW1hcHBlclwiKSxDdXN0b21GaWxlPShhfHxzKSYmKGYmJmYuZ2V0T3JpZ2luYWxTeW1ib2wod2luZG93LFwiRmlsZVwiKXx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEZpbGUmJkZpbGUpLEN1c3RvbUZpbGVSZWFkZXI9KGF8fHMpJiYoZiYmZi5nZXRPcmlnaW5hbFN5bWJvbCh3aW5kb3csXCJGaWxlUmVhZGVyXCIpfHxcInVuZGVmaW5lZFwiIT10eXBlb2YgRmlsZVJlYWRlciYmRmlsZVJlYWRlcik7ZnVuY3Rpb24gZ2V0RmlsZWZyb21EYXRhVXJsKGUsdCxyPURhdGUubm93KCkpe3JldHVybiBuZXcgUHJvbWlzZSgoaT0+e2NvbnN0IG89ZS5zcGxpdChcIixcIiksYT1vWzBdLm1hdGNoKC86KC4qPyk7LylbMV0scz1nbG9iYWxUaGlzLmF0b2Iob1sxXSk7bGV0IGY9cy5sZW5ndGg7Y29uc3QgbD1uZXcgVWludDhBcnJheShmKTtmb3IoO2YtLTspbFtmXT1zLmNoYXJDb2RlQXQoZik7Y29uc3QgYz1uZXcgQmxvYihbbF0se3R5cGU6YX0pO2MubmFtZT10LGMubGFzdE1vZGlmaWVkPXIsaShjKX0pKX1mdW5jdGlvbiBnZXREYXRhVXJsRnJvbUZpbGUoZSl7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2NvbnN0IGk9bmV3IEN1c3RvbUZpbGVSZWFkZXI7aS5vbmxvYWQ9KCk9PnQoaS5yZXN1bHQpLGkub25lcnJvcj1lPT5yKGUpLGkucmVhZEFzRGF0YVVSTChlKX0pKX1mdW5jdGlvbiBsb2FkSW1hZ2UoZSl7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2NvbnN0IGk9bmV3IEltYWdlO2kub25sb2FkPSgpPT50KGkpLGkub25lcnJvcj1lPT5yKGUpLGkuc3JjPWV9KSl9ZnVuY3Rpb24gZ2V0QnJvd3Nlck5hbWUoKXtpZih2b2lkIDAhPT1nZXRCcm93c2VyTmFtZS5jYWNoZWRSZXN1bHQpcmV0dXJuIGdldEJyb3dzZXJOYW1lLmNhY2hlZFJlc3VsdDtsZXQgZT1pLkVUQztjb25zdHt1c2VyQWdlbnQ6dH09bmF2aWdhdG9yO3JldHVybi9DaHJvbShlfGl1bSkvaS50ZXN0KHQpP2U9aS5DSFJPTUU6L2lQKGFkfG9kfGhvbmUpL2kudGVzdCh0KSYmL1dlYktpdC9pLnRlc3QodCk/ZT1pLklPUzovU2FmYXJpL2kudGVzdCh0KT9lPWkuREVTS1RPUF9TQUZBUkk6L0ZpcmVmb3gvaS50ZXN0KHQpP2U9aS5GSVJFRk9YOigvTVNJRS9pLnRlc3QodCl8fCEwPT0hIWRvY3VtZW50LmRvY3VtZW50TW9kZSkmJihlPWkuSUUpLGdldEJyb3dzZXJOYW1lLmNhY2hlZFJlc3VsdD1lLGdldEJyb3dzZXJOYW1lLmNhY2hlZFJlc3VsdH1mdW5jdGlvbiBhcHByb3hpbWF0ZUJlbG93TWF4aW11bUNhbnZhc1NpemVPZkJyb3dzZXIoZSx0KXtjb25zdCByPWdldEJyb3dzZXJOYW1lKCksaT1vW3JdO2xldCBhPWUscz10LGY9YSpzO2NvbnN0IGw9YT5zP3MvYTphL3M7Zm9yKDtmPmkqaTspe2NvbnN0IGU9KGkrYSkvMix0PShpK3MpLzI7ZTx0PyhzPXQsYT10KmwpOihzPWUqbCxhPWUpLGY9YSpzfXJldHVybnt3aWR0aDphLGhlaWdodDpzfX1mdW5jdGlvbiBnZXROZXdDYW52YXNBbmRDdHgoZSx0KXtsZXQgcixpO3RyeXtpZihyPW5ldyBPZmZzY3JlZW5DYW52YXMoZSx0KSxpPXIuZ2V0Q29udGV4dChcIjJkXCIpLG51bGw9PT1pKXRocm93IG5ldyBFcnJvcihcImdldENvbnRleHQgb2YgT2Zmc2NyZWVuQ2FudmFzIHJldHVybnMgbnVsbFwiKX1jYXRjaChlKXtyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksaT1yLmdldENvbnRleHQoXCIyZFwiKX1yZXR1cm4gci53aWR0aD1lLHIuaGVpZ2h0PXQsW3IsaV19ZnVuY3Rpb24gZHJhd0ltYWdlSW5DYW52YXMoZSx0KXtjb25zdHt3aWR0aDpyLGhlaWdodDppfT1hcHByb3hpbWF0ZUJlbG93TWF4aW11bUNhbnZhc1NpemVPZkJyb3dzZXIoZS53aWR0aCxlLmhlaWdodCksW28sYV09Z2V0TmV3Q2FudmFzQW5kQ3R4KHIsaSk7cmV0dXJuIHQmJi9qcGU/Zy8udGVzdCh0KSYmKGEuZmlsbFN0eWxlPVwid2hpdGVcIixhLmZpbGxSZWN0KDAsMCxvLndpZHRoLG8uaGVpZ2h0KSksYS5kcmF3SW1hZ2UoZSwwLDAsby53aWR0aCxvLmhlaWdodCksb31mdW5jdGlvbiBpc0lPUygpe3JldHVybiB2b2lkIDAhPT1pc0lPUy5jYWNoZWRSZXN1bHR8fChpc0lPUy5jYWNoZWRSZXN1bHQ9W1wiaVBhZCBTaW11bGF0b3JcIixcImlQaG9uZSBTaW11bGF0b3JcIixcImlQb2QgU2ltdWxhdG9yXCIsXCJpUGFkXCIsXCJpUGhvbmVcIixcImlQb2RcIl0uaW5jbHVkZXMobmF2aWdhdG9yLnBsYXRmb3JtKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcyhcIk1hY1wiKSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50JiZcIm9udG91Y2hlbmRcImluIGRvY3VtZW50KSxpc0lPUy5jYWNoZWRSZXN1bHR9ZnVuY3Rpb24gZHJhd0ZpbGVJbkNhbnZhcyhlLHQ9e30pe3JldHVybiBuZXcgUHJvbWlzZSgoZnVuY3Rpb24ocixvKXtsZXQgYSxzO3ZhciAkVHJ5XzJfUG9zdD1mdW5jdGlvbigpe3RyeXtyZXR1cm4gcz1kcmF3SW1hZ2VJbkNhbnZhcyhhLHQuZmlsZVR5cGV8fGUudHlwZSkscihbYSxzXSl9Y2F0Y2goZSl7cmV0dXJuIG8oZSl9fSwkVHJ5XzJfQ2F0Y2g9ZnVuY3Rpb24odCl7dHJ5ezA7dmFyICRUcnlfM19DYXRjaD1mdW5jdGlvbihlKXt0cnl7dGhyb3cgZX1jYXRjaChlKXtyZXR1cm4gbyhlKX19O3RyeXtsZXQgdDtyZXR1cm4gZ2V0RGF0YVVybEZyb21GaWxlKGUpLnRoZW4oKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gdD1lLGxvYWRJbWFnZSh0KS50aGVuKChmdW5jdGlvbihlKXt0cnl7cmV0dXJuIGE9ZSxmdW5jdGlvbigpe3RyeXtyZXR1cm4gJFRyeV8yX1Bvc3QoKX1jYXRjaChlKXtyZXR1cm4gbyhlKX19KCl9Y2F0Y2goZSl7cmV0dXJuICRUcnlfM19DYXRjaChlKX19KSwkVHJ5XzNfQ2F0Y2gpfWNhdGNoKGUpe3JldHVybiAkVHJ5XzNfQ2F0Y2goZSl9fSksJFRyeV8zX0NhdGNoKX1jYXRjaChlKXskVHJ5XzNfQ2F0Y2goZSl9fWNhdGNoKGUpe3JldHVybiBvKGUpfX07dHJ5e2lmKGlzSU9TKCl8fFtpLkRFU0tUT1BfU0FGQVJJLGkuTU9CSUxFX1NBRkFSSV0uaW5jbHVkZXMoZ2V0QnJvd3Nlck5hbWUoKSkpdGhyb3cgbmV3IEVycm9yKFwiU2tpcCBjcmVhdGVJbWFnZUJpdG1hcCBvbiBJT1MgYW5kIFNhZmFyaVwiKTtyZXR1cm4gY3JlYXRlSW1hZ2VCaXRtYXAoZSkudGhlbigoZnVuY3Rpb24oZSl7dHJ5e3JldHVybiBhPWUsJFRyeV8yX1Bvc3QoKX1jYXRjaChlKXtyZXR1cm4gJFRyeV8yX0NhdGNoKCl9fSksJFRyeV8yX0NhdGNoKX1jYXRjaChlKXskVHJ5XzJfQ2F0Y2goKX19KSl9ZnVuY3Rpb24gY2FudmFzVG9GaWxlKGUsdCxpLG8sYT0xKXtyZXR1cm4gbmV3IFByb21pc2UoKGZ1bmN0aW9uKHMsZil7bGV0IGw7aWYoXCJpbWFnZS9wbmdcIj09PXQpe2xldCBjLHUsaDtyZXR1cm4gYz1lLmdldENvbnRleHQoXCIyZFwiKSwoe2RhdGE6dX09Yy5nZXRJbWFnZURhdGEoMCwwLGUud2lkdGgsZS5oZWlnaHQpKSxoPVVQTkcuZW5jb2RlKFt1LmJ1ZmZlcl0sZS53aWR0aCxlLmhlaWdodCw0MDk2KmEpLGw9bmV3IEJsb2IoW2hdLHt0eXBlOnR9KSxsLm5hbWU9aSxsLmxhc3RNb2RpZmllZD1vLCRJZl80LmNhbGwodGhpcyl9e2lmKFwiaW1hZ2UvYm1wXCI9PT10KXJldHVybiBuZXcgUHJvbWlzZSgodD0+ci50b0Jsb2IoZSx0KSkpLnRoZW4oZnVuY3Rpb24oZSl7dHJ5e3JldHVybiBsPWUsbC5uYW1lPWksbC5sYXN0TW9kaWZpZWQ9bywkSWZfNS5jYWxsKHRoaXMpfWNhdGNoKGUpe3JldHVybiBmKGUpfX0uYmluZCh0aGlzKSxmKTt7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgT2Zmc2NyZWVuQ2FudmFzJiZlIGluc3RhbmNlb2YgT2Zmc2NyZWVuQ2FudmFzKXJldHVybiBlLmNvbnZlcnRUb0Jsb2Ioe3R5cGU6dCxxdWFsaXR5OmF9KS50aGVuKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gbD1lLGwubmFtZT1pLGwubGFzdE1vZGlmaWVkPW8sJElmXzYuY2FsbCh0aGlzKX1jYXRjaChlKXtyZXR1cm4gZihlKX19LmJpbmQodGhpcyksZik7e2xldCBkO3JldHVybiBkPWUudG9EYXRhVVJMKHQsYSksZ2V0RmlsZWZyb21EYXRhVXJsKGQsaSxvKS50aGVuKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gbD1lLCRJZl82LmNhbGwodGhpcyl9Y2F0Y2goZSl7cmV0dXJuIGYoZSl9fS5iaW5kKHRoaXMpLGYpfWZ1bmN0aW9uICRJZl82KCl7cmV0dXJuICRJZl81LmNhbGwodGhpcyl9fWZ1bmN0aW9uICRJZl81KCl7cmV0dXJuICRJZl80LmNhbGwodGhpcyl9fWZ1bmN0aW9uICRJZl80KCl7cmV0dXJuIHMobCl9fSkpfWZ1bmN0aW9uIGNsZWFudXBDYW52YXNNZW1vcnkoZSl7ZS53aWR0aD0wLGUuaGVpZ2h0PTB9ZnVuY3Rpb24gaXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIoKXtyZXR1cm4gbmV3IFByb21pc2UoKGZ1bmN0aW9uKGUsdCl7bGV0IHIsaSxvLGEscztyZXR1cm4gdm9pZCAwIT09aXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIuY2FjaGVkUmVzdWx0P2UoaXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIuY2FjaGVkUmVzdWx0KToocj1cImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRRQWlSWGhwWmdBQVRVMEFLZ0FBQUFnQUFRRVNBQU1BQUFBQkFBWUFBQUFBQUFELzJ3Q0VBQUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQWYvQUFCRUlBQUVBQWdNQkVRQUNFUUVERVFIL3hBQktBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUxFQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFFUUVBQUFBQUFBQUFBQUFBQUFBQUFBQUEvOW9BREFNQkFBSVJBeEVBUHdBLzhILy8yUT09XCIsZ2V0RmlsZWZyb21EYXRhVXJsKFwiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNFFBaVJYaHBaZ0FBVFUwQUtnQUFBQWdBQVFFU0FBTUFBQUFCQUFZQUFBQUFBQUQvMndDRUFBRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBZi9BQUJFSUFBRUFBZ01CRVFBQ0VRRURFUUgveEFCS0FBRUFBQUFBQUFBQUFBQUFBQUFBQUFBTEVBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFRRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUVRRUFBQUFBQUFBQUFBQUFBQUFBQUFBQS85b0FEQU1CQUFJUkF4RUFQd0EvOEgvLzJRPT1cIixcInRlc3QuanBnXCIsRGF0ZS5ub3coKSkudGhlbigoZnVuY3Rpb24ocil7dHJ5e3JldHVybiBpPXIsZHJhd0ZpbGVJbkNhbnZhcyhpKS50aGVuKChmdW5jdGlvbihyKXt0cnl7cmV0dXJuIG89clsxXSxjYW52YXNUb0ZpbGUobyxpLnR5cGUsaS5uYW1lLGkubGFzdE1vZGlmaWVkKS50aGVuKChmdW5jdGlvbihyKXt0cnl7cmV0dXJuIGE9cixjbGVhbnVwQ2FudmFzTWVtb3J5KG8pLGRyYXdGaWxlSW5DYW52YXMoYSkudGhlbigoZnVuY3Rpb24ocil7dHJ5e3JldHVybiBzPXJbMF0saXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIuY2FjaGVkUmVzdWx0PTE9PT1zLndpZHRoJiYyPT09cy5oZWlnaHQsZShpc0F1dG9PcmllbnRhdGlvbkluQnJvd3Nlci5jYWNoZWRSZXN1bHQpfWNhdGNoKGUpe3JldHVybiB0KGUpfX0pLHQpfWNhdGNoKGUpe3JldHVybiB0KGUpfX0pLHQpfWNhdGNoKGUpe3JldHVybiB0KGUpfX0pLHQpfWNhdGNoKGUpe3JldHVybiB0KGUpfX0pLHQpKX0pKX1mdW5jdGlvbiBnZXRFeGlmT3JpZW50YXRpb24oZSl7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2NvbnN0IGk9bmV3IEN1c3RvbUZpbGVSZWFkZXI7aS5vbmxvYWQ9ZT0+e2NvbnN0IHI9bmV3IERhdGFWaWV3KGUudGFyZ2V0LnJlc3VsdCk7aWYoNjU0OTYhPXIuZ2V0VWludDE2KDAsITEpKXJldHVybiB0KC0yKTtjb25zdCBpPXIuYnl0ZUxlbmd0aDtsZXQgbz0yO2Zvcig7bzxpOyl7aWYoci5nZXRVaW50MTYobysyLCExKTw9OClyZXR1cm4gdCgtMSk7Y29uc3QgZT1yLmdldFVpbnQxNihvLCExKTtpZihvKz0yLDY1NTA1PT1lKXtpZigxMTY1NTE5MjA2IT1yLmdldFVpbnQzMihvKz0yLCExKSlyZXR1cm4gdCgtMSk7Y29uc3QgZT0xODc2MT09ci5nZXRVaW50MTYobys9NiwhMSk7bys9ci5nZXRVaW50MzIobys0LGUpO2NvbnN0IGk9ci5nZXRVaW50MTYobyxlKTtvKz0yO2ZvcihsZXQgYT0wO2E8aTthKyspaWYoMjc0PT1yLmdldFVpbnQxNihvKzEyKmEsZSkpcmV0dXJuIHQoci5nZXRVaW50MTYobysxMiphKzgsZSkpfWVsc2V7aWYoNjUyODAhPSg2NTI4MCZlKSlicmVhaztvKz1yLmdldFVpbnQxNihvLCExKX19cmV0dXJuIHQoLTEpfSxpLm9uZXJyb3I9ZT0+cihlKSxpLnJlYWRBc0FycmF5QnVmZmVyKGUpfSkpfWZ1bmN0aW9uIGhhbmRsZU1heFdpZHRoT3JIZWlnaHQoZSx0KXtjb25zdHt3aWR0aDpyfT1lLHtoZWlnaHQ6aX09ZSx7bWF4V2lkdGhPckhlaWdodDpvfT10O2xldCBhLHM9ZTtyZXR1cm4gaXNGaW5pdGUobykmJihyPm98fGk+bykmJihbcyxhXT1nZXROZXdDYW52YXNBbmRDdHgocixpKSxyPmk/KHMud2lkdGg9byxzLmhlaWdodD1pL3Iqbyk6KHMud2lkdGg9ci9pKm8scy5oZWlnaHQ9byksYS5kcmF3SW1hZ2UoZSwwLDAscy53aWR0aCxzLmhlaWdodCksY2xlYW51cENhbnZhc01lbW9yeShlKSksc31mdW5jdGlvbiBmb2xsb3dFeGlmT3JpZW50YXRpb24oZSx0KXtjb25zdHt3aWR0aDpyfT1lLHtoZWlnaHQ6aX09ZSxbbyxhXT1nZXROZXdDYW52YXNBbmRDdHgocixpKTtzd2l0Y2godD40JiZ0PDk/KG8ud2lkdGg9aSxvLmhlaWdodD1yKTooby53aWR0aD1yLG8uaGVpZ2h0PWkpLHQpe2Nhc2UgMjphLnRyYW5zZm9ybSgtMSwwLDAsMSxyLDApO2JyZWFrO2Nhc2UgMzphLnRyYW5zZm9ybSgtMSwwLDAsLTEscixpKTticmVhaztjYXNlIDQ6YS50cmFuc2Zvcm0oMSwwLDAsLTEsMCxpKTticmVhaztjYXNlIDU6YS50cmFuc2Zvcm0oMCwxLDEsMCwwLDApO2JyZWFrO2Nhc2UgNjphLnRyYW5zZm9ybSgwLDEsLTEsMCxpLDApO2JyZWFrO2Nhc2UgNzphLnRyYW5zZm9ybSgwLC0xLC0xLDAsaSxyKTticmVhaztjYXNlIDg6YS50cmFuc2Zvcm0oMCwtMSwxLDAsMCxyKX1yZXR1cm4gYS5kcmF3SW1hZ2UoZSwwLDAscixpKSxjbGVhbnVwQ2FudmFzTWVtb3J5KGUpLG99ZnVuY3Rpb24gY29tcHJlc3MoZSx0LHI9MCl7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihpLG8pe2xldCBhLHMsZixsLGMsdSxoLGQsQSxnLHAsbSx3LHYsYix5LEUsRixfLEI7ZnVuY3Rpb24gaW5jUHJvZ3Jlc3MoZT01KXtpZih0LnNpZ25hbCYmdC5zaWduYWwuYWJvcnRlZCl0aHJvdyB0LnNpZ25hbC5yZWFzb247YSs9ZSx0Lm9uUHJvZ3Jlc3MoTWF0aC5taW4oYSwxMDApKX1mdW5jdGlvbiBzZXRQcm9ncmVzcyhlKXtpZih0LnNpZ25hbCYmdC5zaWduYWwuYWJvcnRlZCl0aHJvdyB0LnNpZ25hbC5yZWFzb247YT1NYXRoLm1pbihNYXRoLm1heChlLGEpLDEwMCksdC5vblByb2dyZXNzKGEpfXJldHVybiBhPXIscz10Lm1heEl0ZXJhdGlvbnx8MTAsZj0xMDI0KnQubWF4U2l6ZU1CKjEwMjQsaW5jUHJvZ3Jlc3MoKSxkcmF3RmlsZUluQ2FudmFzKGUsdCkudGhlbihmdW5jdGlvbihyKXt0cnl7cmV0dXJuWyxsXT1yLGluY1Byb2dyZXNzKCksYz1oYW5kbGVNYXhXaWR0aE9ySGVpZ2h0KGwsdCksaW5jUHJvZ3Jlc3MoKSxuZXcgUHJvbWlzZSgoZnVuY3Rpb24ocixpKXt2YXIgbztpZighKG89dC5leGlmT3JpZW50YXRpb24pKXJldHVybiBnZXRFeGlmT3JpZW50YXRpb24oZSkudGhlbihmdW5jdGlvbihlKXt0cnl7cmV0dXJuIG89ZSwkSWZfMi5jYWxsKHRoaXMpfWNhdGNoKGUpe3JldHVybiBpKGUpfX0uYmluZCh0aGlzKSxpKTtmdW5jdGlvbiAkSWZfMigpe3JldHVybiByKG8pfXJldHVybiAkSWZfMi5jYWxsKHRoaXMpfSkpLnRoZW4oZnVuY3Rpb24ocil7dHJ5e3JldHVybiB1PXIsaW5jUHJvZ3Jlc3MoKSxpc0F1dG9PcmllbnRhdGlvbkluQnJvd3NlcigpLnRoZW4oZnVuY3Rpb24ocil7dHJ5e3JldHVybiBoPXI/Yzpmb2xsb3dFeGlmT3JpZW50YXRpb24oYyx1KSxpbmNQcm9ncmVzcygpLGQ9dC5pbml0aWFsUXVhbGl0eXx8MSxBPXQuZmlsZVR5cGV8fGUudHlwZSxjYW52YXNUb0ZpbGUoaCxBLGUubmFtZSxlLmxhc3RNb2RpZmllZCxkKS50aGVuKGZ1bmN0aW9uKHIpe3RyeXt7aWYoZz1yLGluY1Byb2dyZXNzKCkscD1nLnNpemU+ZixtPWcuc2l6ZT5lLnNpemUsIXAmJiFtKXJldHVybiBzZXRQcm9ncmVzcygxMDApLGkoZyk7dmFyIGE7ZnVuY3Rpb24gJExvb3BfMygpe2lmKHMtLSYmKGI+Znx8Yj53KSl7bGV0IHQscjtyZXR1cm4gdD1CPy45NSpfLndpZHRoOl8ud2lkdGgscj1CPy45NSpfLmhlaWdodDpfLmhlaWdodCxbRSxGXT1nZXROZXdDYW52YXNBbmRDdHgodCxyKSxGLmRyYXdJbWFnZShfLDAsMCx0LHIpLGQqPVwiaW1hZ2UvcG5nXCI9PT1BPy44NTouOTUsY2FudmFzVG9GaWxlKEUsQSxlLm5hbWUsZS5sYXN0TW9kaWZpZWQsZCkudGhlbigoZnVuY3Rpb24oZSl7dHJ5e3JldHVybiB5PWUsY2xlYW51cENhbnZhc01lbW9yeShfKSxfPUUsYj15LnNpemUsc2V0UHJvZ3Jlc3MoTWF0aC5taW4oOTksTWF0aC5mbG9vcigodi1iKS8odi1mKSoxMDApKSksJExvb3BfM31jYXRjaChlKXtyZXR1cm4gbyhlKX19KSxvKX1yZXR1cm5bMV19cmV0dXJuIHc9ZS5zaXplLHY9Zy5zaXplLGI9dixfPWgsQj0hdC5hbHdheXNLZWVwUmVzb2x1dGlvbiYmcCwoYT1mdW5jdGlvbihlKXtmb3IoO2U7KXtpZihlLnRoZW4pcmV0dXJuIHZvaWQgZS50aGVuKGEsbyk7dHJ5e2lmKGUucG9wKXtpZihlLmxlbmd0aClyZXR1cm4gZS5wb3AoKT8kTG9vcF8zX2V4aXQuY2FsbCh0aGlzKTplO2U9JExvb3BfM31lbHNlIGU9ZS5jYWxsKHRoaXMpfWNhdGNoKGUpe3JldHVybiBvKGUpfX19LmJpbmQodGhpcykpKCRMb29wXzMpO2Z1bmN0aW9uICRMb29wXzNfZXhpdCgpe3JldHVybiBjbGVhbnVwQ2FudmFzTWVtb3J5KF8pLGNsZWFudXBDYW52YXNNZW1vcnkoRSksY2xlYW51cENhbnZhc01lbW9yeShjKSxjbGVhbnVwQ2FudmFzTWVtb3J5KGgpLGNsZWFudXBDYW52YXNNZW1vcnkobCksc2V0UHJvZ3Jlc3MoMTAwKSxpKHkpfX19Y2F0Y2godSl7cmV0dXJuIG8odSl9fS5iaW5kKHRoaXMpLG8pfWNhdGNoKGUpe3JldHVybiBvKGUpfX0uYmluZCh0aGlzKSxvKX1jYXRjaChlKXtyZXR1cm4gbyhlKX19LmJpbmQodGhpcyksbyl9Y2F0Y2goZSl7cmV0dXJuIG8oZSl9fS5iaW5kKHRoaXMpLG8pfSkpfWNvbnN0IGw9XCJcXG5sZXQgc2NyaXB0SW1wb3J0ZWQgPSBmYWxzZVxcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGFzeW5jIChlKSA9PiB7XFxuICBjb25zdCB7IGZpbGUsIGlkLCBpbWFnZUNvbXByZXNzaW9uTGliVXJsLCBvcHRpb25zIH0gPSBlLmRhdGFcXG4gIG9wdGlvbnMub25Qcm9ncmVzcyA9IChwcm9ncmVzcykgPT4gc2VsZi5wb3N0TWVzc2FnZSh7IHByb2dyZXNzLCBpZCB9KVxcbiAgdHJ5IHtcXG4gICAgaWYgKCFzY3JpcHRJbXBvcnRlZCkge1xcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdbd29ya2VyXSBpbXBvcnRTY3JpcHRzJywgaW1hZ2VDb21wcmVzc2lvbkxpYlVybClcXG4gICAgICBzZWxmLmltcG9ydFNjcmlwdHMoaW1hZ2VDb21wcmVzc2lvbkxpYlVybClcXG4gICAgICBzY3JpcHRJbXBvcnRlZCA9IHRydWVcXG4gICAgfVxcbiAgICAvLyBjb25zb2xlLmxvZygnW3dvcmtlcl0gc2VsZicsIHNlbGYpXFxuICAgIGNvbnN0IGNvbXByZXNzZWRGaWxlID0gYXdhaXQgaW1hZ2VDb21wcmVzc2lvbihmaWxlLCBvcHRpb25zKVxcbiAgICBzZWxmLnBvc3RNZXNzYWdlKHsgZmlsZTogY29tcHJlc3NlZEZpbGUsIGlkIH0pXFxuICB9IGNhdGNoIChlKSB7XFxuICAgIC8vIGNvbnNvbGUuZXJyb3IoJ1t3b3JrZXJdIGVycm9yJywgZSlcXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7IGVycm9yOiBlLm1lc3NhZ2UgKyAnXFxcXG4nICsgZS5zdGFjaywgaWQgfSlcXG4gIH1cXG59KVxcblwiO2xldCBjO2Z1bmN0aW9uIGNvbXByZXNzT25XZWJXb3JrZXIoZSx0KXtyZXR1cm4gbmV3IFByb21pc2UoKChyLGkpPT57Y3x8KGM9ZnVuY3Rpb24gY3JlYXRlV29ya2VyU2NyaXB0VVJMKGUpe2NvbnN0IHQ9W107cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgZT90LnB1c2goYCgke2V9KSgpYCk6dC5wdXNoKGUpLFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IodCkpfShsKSk7Y29uc3Qgbz1uZXcgV29ya2VyKGMpO28uYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwoZnVuY3Rpb24gaGFuZGxlcihlKXtpZih0LnNpZ25hbCYmdC5zaWduYWwuYWJvcnRlZClvLnRlcm1pbmF0ZSgpO2Vsc2UgaWYodm9pZCAwPT09ZS5kYXRhLnByb2dyZXNzKXtpZihlLmRhdGEuZXJyb3IpcmV0dXJuIGkobmV3IEVycm9yKGUuZGF0YS5lcnJvcikpLHZvaWQgby50ZXJtaW5hdGUoKTtyKGUuZGF0YS5maWxlKSxvLnRlcm1pbmF0ZSgpfWVsc2UgdC5vblByb2dyZXNzKGUuZGF0YS5wcm9ncmVzcyl9KSksby5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixpKSx0LnNpZ25hbCYmdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsKCgpPT57aSh0LnNpZ25hbC5yZWFzb24pLG8udGVybWluYXRlKCl9KSksby5wb3N0TWVzc2FnZSh7ZmlsZTplLGltYWdlQ29tcHJlc3Npb25MaWJVcmw6dC5saWJVUkwsb3B0aW9uczp7Li4udCxvblByb2dyZXNzOnZvaWQgMCxzaWduYWw6dm9pZCAwfX0pfSkpfWZ1bmN0aW9uIGltYWdlQ29tcHJlc3Npb24oZSx0KXtyZXR1cm4gbmV3IFByb21pc2UoKGZ1bmN0aW9uKHIsaSl7bGV0IG8sYSxzLGYsbCxjO2lmKG89ey4uLnR9LHM9MCwoe29uUHJvZ3Jlc3M6Zn09byksby5tYXhTaXplTUI9by5tYXhTaXplTUJ8fE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxsPVwiYm9vbGVhblwiIT10eXBlb2Ygby51c2VXZWJXb3JrZXJ8fG8udXNlV2ViV29ya2VyLGRlbGV0ZSBvLnVzZVdlYldvcmtlcixvLm9uUHJvZ3Jlc3M9ZT0+e3M9ZSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBmJiZmKHMpfSwhKGUgaW5zdGFuY2VvZiBCbG9ifHxlIGluc3RhbmNlb2YgQ3VzdG9tRmlsZSkpcmV0dXJuIGkobmV3IEVycm9yKFwiVGhlIGZpbGUgZ2l2ZW4gaXMgbm90IGFuIGluc3RhbmNlIG9mIEJsb2Igb3IgRmlsZVwiKSk7aWYoIS9eaW1hZ2UvLnRlc3QoZS50eXBlKSlyZXR1cm4gaShuZXcgRXJyb3IoXCJUaGUgZmlsZSBnaXZlbiBpcyBub3QgYW4gaW1hZ2VcIikpO2lmKGM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlJiZzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUsIWx8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdvcmtlcnx8YylyZXR1cm4gY29tcHJlc3MoZSxvKS50aGVuKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gYT1lLCRJZl80LmNhbGwodGhpcyl9Y2F0Y2goZSl7cmV0dXJuIGkoZSl9fS5iaW5kKHRoaXMpLGkpO3ZhciB1PWZ1bmN0aW9uKCl7dHJ5e3JldHVybiAkSWZfNC5jYWxsKHRoaXMpfWNhdGNoKGUpe3JldHVybiBpKGUpfX0uYmluZCh0aGlzKSwkVHJ5XzFfQ2F0Y2g9ZnVuY3Rpb24odCl7dHJ5e3JldHVybiBjb21wcmVzcyhlLG8pLnRoZW4oKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gYT1lLHUoKX1jYXRjaChlKXtyZXR1cm4gaShlKX19KSxpKX1jYXRjaChlKXtyZXR1cm4gaShlKX19O3RyeXtyZXR1cm4gby5saWJVUkw9by5saWJVUkx8fFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9icm93c2VyLWltYWdlLWNvbXByZXNzaW9uQDIuMC4yL2Rpc3QvYnJvd3Nlci1pbWFnZS1jb21wcmVzc2lvbi5qc1wiLGNvbXByZXNzT25XZWJXb3JrZXIoZSxvKS50aGVuKChmdW5jdGlvbihlKXt0cnl7cmV0dXJuIGE9ZSx1KCl9Y2F0Y2goZSl7cmV0dXJuICRUcnlfMV9DYXRjaCgpfX0pLCRUcnlfMV9DYXRjaCl9Y2F0Y2goZSl7JFRyeV8xX0NhdGNoKCl9ZnVuY3Rpb24gJElmXzQoKXt0cnl7YS5uYW1lPWUubmFtZSxhLmxhc3RNb2RpZmllZD1lLmxhc3RNb2RpZmllZH1jYXRjaChlKXt9dHJ5e28ucHJlc2VydmVFeGlmJiZcImltYWdlL2pwZWdcIj09PWUudHlwZSYmKCFvLmZpbGVUeXBlfHxvLmZpbGVUeXBlJiZvLmZpbGVUeXBlPT09ZS50eXBlKSYmKGE9Y29weUV4aWZXaXRob3V0T3JpZW50YXRpb24oZSxhKSl9Y2F0Y2goZSl7fXJldHVybiByKGEpfX0pKX1pbWFnZUNvbXByZXNzaW9uLmdldERhdGFVcmxGcm9tRmlsZT1nZXREYXRhVXJsRnJvbUZpbGUsaW1hZ2VDb21wcmVzc2lvbi5nZXRGaWxlZnJvbURhdGFVcmw9Z2V0RmlsZWZyb21EYXRhVXJsLGltYWdlQ29tcHJlc3Npb24ubG9hZEltYWdlPWxvYWRJbWFnZSxpbWFnZUNvbXByZXNzaW9uLmRyYXdJbWFnZUluQ2FudmFzPWRyYXdJbWFnZUluQ2FudmFzLGltYWdlQ29tcHJlc3Npb24uZHJhd0ZpbGVJbkNhbnZhcz1kcmF3RmlsZUluQ2FudmFzLGltYWdlQ29tcHJlc3Npb24uY2FudmFzVG9GaWxlPWNhbnZhc1RvRmlsZSxpbWFnZUNvbXByZXNzaW9uLmdldEV4aWZPcmllbnRhdGlvbj1nZXRFeGlmT3JpZW50YXRpb24saW1hZ2VDb21wcmVzc2lvbi5oYW5kbGVNYXhXaWR0aE9ySGVpZ2h0PWhhbmRsZU1heFdpZHRoT3JIZWlnaHQsaW1hZ2VDb21wcmVzc2lvbi5mb2xsb3dFeGlmT3JpZW50YXRpb249Zm9sbG93RXhpZk9yaWVudGF0aW9uLGltYWdlQ29tcHJlc3Npb24uY2xlYW51cENhbnZhc01lbW9yeT1jbGVhbnVwQ2FudmFzTWVtb3J5LGltYWdlQ29tcHJlc3Npb24uaXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXI9aXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIsaW1hZ2VDb21wcmVzc2lvbi5hcHByb3hpbWF0ZUJlbG93TWF4aW11bUNhbnZhc1NpemVPZkJyb3dzZXI9YXBwcm94aW1hdGVCZWxvd01heGltdW1DYW52YXNTaXplT2ZCcm93c2VyLGltYWdlQ29tcHJlc3Npb24uY29weUV4aWZXaXRob3V0T3JpZW50YXRpb249Y29weUV4aWZXaXRob3V0T3JpZW50YXRpb24saW1hZ2VDb21wcmVzc2lvbi5nZXRCcm93c2VyTmFtZT1nZXRCcm93c2VyTmFtZSxpbWFnZUNvbXByZXNzaW9uLnZlcnNpb249XCIyLjAuMlwiO2V4cG9ydHtpbWFnZUNvbXByZXNzaW9uIGFzIGRlZmF1bHR9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnJvd3Nlci1pbWFnZS1jb21wcmVzc2lvbi5tanMubWFwXG4iLCJpbXBvcnQgeyBhcHBlbmQsIGF0dHIsIGNyZWF0ZSwgZmluZCwgZm9jdXMsIHJlbW92ZSwgcmVtb3ZlQXR0ciB9IGZyb20gJy4uL3V0aWxzL0pxdWVyeVdyYXBwZXJzJ1xyXG5pbXBvcnQgeyBpc1Zlcmlvc25BZnRlcjEzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnXHJcblxyXG5jb25zdCB0b2dnbGVDaGF0ID0gKGNoYXQ6IEpRdWVyeSwgdG9nZ2xlOiBib29sZWFuKSA9PiB7XHJcbiAgaWYgKCF0b2dnbGUpIHtcclxuICAgIGF0dHIoY2hhdCwgJ2Rpc2FibGVkJywgdHJ1ZSlcclxuICAgIHJldHVyblxyXG4gIH1cclxuICByZW1vdmVBdHRyKGNoYXQsICdkaXNhYmxlZCcpXHJcbiAgZm9jdXMoY2hhdClcclxufVxyXG5cclxuY29uc3QgdG9nZ2xlU3Bpbm5lciA9IChjaGF0Rm9ybTogSlF1ZXJ5LCB0b2dnbGU6IGJvb2xlYW4pID0+IHtcclxuICBjb25zdCBzcGlubmVySWQgPSAnY2ktc3Bpbm5lcidcclxuICBjb25zdCBzcGlubmVyID0gZmluZChgIyR7c3Bpbm5lcklkfWAsIGNoYXRGb3JtKVxyXG5cclxuICBpZiAoIXRvZ2dsZSAmJiBzcGlubmVyWzBdKSB7XHJcbiAgICByZW1vdmUoc3Bpbm5lcilcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgaWYgKHRvZ2dsZSAmJiAhc3Bpbm5lclswXSkge1xyXG4gICAgY29uc3QgbmV3U3Bpbm5lciA9IGNyZWF0ZShgPGRpdiBpZD1cIiR7c3Bpbm5lcklkfVwiPjwvZGl2PmApXHJcbiAgICBhcHBlbmQoY2hhdEZvcm0sIG5ld1NwaW5uZXIpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VXBsb2FkaW5nU3RhdGVzID0gKHNpZGViYXI6IEpRdWVyeSkgPT4ge1xyXG4gIGNvbnN0IGNoYXRGb3JtUXVlcnkgPSBpc1Zlcmlvc25BZnRlcjEzKCkgPyAnLmNoYXQtZm9ybScgOiAnI2NoYXQtZm9ybSdcclxuICBjb25zdCBjaGF0Rm9ybSA9IGZpbmQoY2hhdEZvcm1RdWVyeSwgc2lkZWJhcilcclxuICBjb25zdCBjaGF0ID0gZmluZCgnI2NoYXQtbWVzc2FnZScsIHNpZGViYXIpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvbigpIHtcclxuICAgICAgdG9nZ2xlQ2hhdChjaGF0LCBmYWxzZSlcclxuICAgICAgdG9nZ2xlU3Bpbm5lcihjaGF0Rm9ybSwgdHJ1ZSlcclxuICAgIH0sXHJcbiAgICBvZmYoKSB7XHJcbiAgICAgIHRvZ2dsZUNoYXQoY2hhdCwgdHJ1ZSlcclxuICAgICAgdG9nZ2xlU3Bpbm5lcihjaGF0Rm9ybSwgZmFsc2UpXHJcbiAgICB9LFxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBPUklHSU5fRk9MREVSLCB0LCBGaWxlUGlja2VySW1wbGVtZW50YXRpb24gfSBmcm9tICcuL1V0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVVcGxvYWRGb2xkZXIgPSBhc3luYyAodXBsb2FkTG9jYXRpb24/OiBzdHJpbmcpID0+IHtcclxuICBjb25zdCBsb2NhdGlvbiA9IHVwbG9hZExvY2F0aW9uIHx8IGdldFNldHRpbmcoJ3VwbG9hZExvY2F0aW9uJylcclxuICB0cnkge1xyXG4gICAgY29uc3QgZm9sZGVyTG9jYXRpb24gPSBhd2FpdCBGaWxlUGlja2VySW1wbGVtZW50YXRpb24oKS5icm93c2UoT1JJR0lOX0ZPTERFUiwgbG9jYXRpb24pXHJcbiAgICBpZiAoZm9sZGVyTG9jYXRpb24udGFyZ2V0ID09PSAnLicpIGF3YWl0IEZpbGVQaWNrZXJJbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURpcmVjdG9yeShPUklHSU5fRk9MREVSLCBsb2NhdGlvbiwge30pXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgRmlsZVBpY2tlckltcGxlbWVudGF0aW9uKCkuY3JlYXRlRGlyZWN0b3J5KE9SSUdJTl9GT0xERVIsIGxvY2F0aW9uLCB7fSlcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAvLyBUaGUgRmlsZVBpY2tlciB0aG9yd3MgYW4gZXJyb3Igd2hlbiB5b3UgaGF2ZSBhIHVzZXIgd2l0aG91dCB1cGxvYWQgcGVybWlzc2lvbnNcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTZXR0aW5nID0gKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB7XHJcbiAgLy8gQHRzLWlnbm9yZVxyXG4gIHJldHVybiAoZ2FtZSBhcyBHYW1lKS5zZXR0aW5ncy5zZXQoJ2NoYXQtaW1hZ2VzJywga2V5LCB2YWx1ZSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNldHRpbmdzID0gKCkgPT4gW1xyXG4gIHtcclxuICAgIGtleTogJ3VwbG9hZEJ1dHRvbicsXHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIG5hbWU6IHQoJ3VwbG9hZEJ1dHRvbicpLFxyXG4gICAgICBoaW50OiB0KCd1cGxvYWRCdXR0b25IaW50JyksXHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgIGNvbmZpZzogdHJ1ZSxcclxuICAgICAgcmVxdWlyZXNSZWxvYWQ6IHRydWUsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAge1xyXG4gICAga2V5OiAndXBsb2FkTG9jYXRpb24nLFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICBuYW1lOiB0KCd1cGxvYWRMb2NhdGlvbicpLFxyXG4gICAgICBoaW50OiB0KCd1cGxvYWRMb2NhdGlvbkhpbnQnKSxcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAndXBsb2FkZWQtY2hhdC1pbWFnZXMnLFxyXG4gICAgICBzY29wZTogJ3dvcmxkJyxcclxuICAgICAgY29uZmlnOiB0cnVlLFxyXG4gICAgICByZXN0cmljdGVkOiB0cnVlLFxyXG4gICAgICBvbkNoYW5nZTogYXN5bmMgKG5ld1VwbG9hZExvY2F0aW9uOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBkZWZhdWx0TG9jYXRpb24gPSAndXBsb2FkZWQtY2hhdC1pbWFnZXMnXHJcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gbmV3VXBsb2FkTG9jYXRpb24udHJpbSgpXHJcbiAgICAgICAgbGV0IHNob3VsZENoYW5nZUxvY2F0aW9uID0gZmFsc2VcclxuXHJcbiAgICAgICAgaWYgKCFsb2NhdGlvbikge1xyXG4gICAgICAgICAgbG9jYXRpb24gPSBkZWZhdWx0TG9jYXRpb25cclxuICAgICAgICAgIHNob3VsZENoYW5nZUxvY2F0aW9uID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9jYXRpb24gPSBsb2NhdGlvbi5yZXBsYWNlKC9cXHMrL2csICctJylcclxuICAgICAgICBpZiAobmV3VXBsb2FkTG9jYXRpb24gIT09IGxvY2F0aW9uKSBzaG91bGRDaGFuZ2VMb2NhdGlvbiA9IHRydWVcclxuXHJcbiAgICAgICAgYXdhaXQgY3JlYXRlVXBsb2FkRm9sZGVyKGxvY2F0aW9uKVxyXG4gICAgICAgIGlmIChzaG91bGRDaGFuZ2VMb2NhdGlvbikgYXdhaXQgc2V0U2V0dGluZygndXBsb2FkTG9jYXRpb24nLCBsb2NhdGlvbilcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuXVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyU2V0dGluZyA9IChzZXR0aW5nOiB7IGtleTogc3RyaW5nLCBvcHRpb25zOiBhbnkgfSkgPT4ge1xyXG4gIC8vIEB0cy1pZ25vcmVcclxuICByZXR1cm4gKGdhbWUgYXMgR2FtZSkuc2V0dGluZ3MucmVnaXN0ZXIoJ2NoYXQtaW1hZ2VzJywgc2V0dGluZy5rZXksIHNldHRpbmcub3B0aW9ucylcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNldHRpbmcgPSAoa2V5OiBzdHJpbmcpOiBhbnkgPT4ge1xyXG4gIC8vIEB0cy1pZ25vcmVcclxuICByZXR1cm4gKGdhbWUgYXMgR2FtZSkuc2V0dGluZ3MuZ2V0KCdjaGF0LWltYWdlcycsIGtleSlcclxufVxyXG4iLCJpbXBvcnQgeyBGaWxlUGlja2VySW1wbGVtZW50YXRpb24sIE9SSUdJTl9GT0xERVIsIHJhbmRvbVN0cmluZywgdCwgdXNlckNhblVwbG9hZCB9IGZyb20gJy4uL3V0aWxzL1V0aWxzJ1xyXG5pbXBvcnQgeyBhZGRDbGFzcywgYXBwZW5kLCBjcmVhdGUsIGZpbmQsIG9uLCByZW1vdmUsIHJlbW92ZUNsYXNzIH0gZnJvbSAnLi4vdXRpbHMvSnF1ZXJ5V3JhcHBlcnMnXHJcbmltcG9ydCBpbWFnZUNvbXByZXNzaW9uIGZyb20gJ2Jyb3dzZXItaW1hZ2UtY29tcHJlc3Npb24nXHJcbmltcG9ydCB7IGdldFVwbG9hZGluZ1N0YXRlcyB9IGZyb20gJy4uL2NvbXBvbmVudHMvTG9hZGVyJ1xyXG5pbXBvcnQgeyBnZXRTZXR0aW5nIH0gZnJvbSAnLi4vdXRpbHMvU2V0dGluZ3MnXHJcblxyXG5leHBvcnQgdHlwZSBTYXZlVmFsdWVUeXBlID0ge1xyXG4gIHR5cGU/OiBzdHJpbmcsXHJcbiAgbmFtZT86IHN0cmluZyxcclxuICBmaWxlPzogRmlsZSxcclxuICBpbWFnZVNyYzogc3RyaW5nIHwgQXJyYXlCdWZmZXIgfCBudWxsLFxyXG4gIGlkOiBzdHJpbmcsXHJcbn1cclxuXHJcbmNvbnN0IFJFU1RSSUNURURfRE9NQUlOUyA9IFsnc3RhdGljLndpa2lhJ11cclxuXHJcbmNvbnN0IERPTV9QQVJTRVIgPSBuZXcgRE9NUGFyc2VyKClcclxuXHJcbmxldCBpbWFnZVF1ZXVlOiBTYXZlVmFsdWVUeXBlW10gPSBbXVxyXG5cclxuY29uc3QgaXNGaWxlSW1hZ2UgPSAoZmlsZTogRmlsZSB8IERhdGFUcmFuc2Zlckl0ZW0pID0+IGZpbGUudHlwZSAmJiBmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJylcclxuXHJcbmNvbnN0IGNyZWF0ZUltYWdlUHJldmlldyA9ICh7IGltYWdlU3JjLCBpZCB9OiBTYXZlVmFsdWVUeXBlKTogSlF1ZXJ5ID0+IGNyZWF0ZShcclxuICBgPGRpdiBpZD1cIiR7aWR9XCIgY2xhc3M9XCJjaS11cGxvYWQtYXJlYS1pbWFnZVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImNpLXJlbW92ZS1pbWFnZS1pY29uIGZhLXJlZ3VsYXIgZmEtY2lyY2xlLXhtYXJrXCI+PC9pPlxyXG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwiY2ktaW1hZ2UtcHJldmlld1wiIHNyYz1cIiR7aW1hZ2VTcmN9XCIgYWx0PVwiJHt0KCd1bmFibGVUb0xvYWRJbWFnZScpfVwiLz5cclxuICAgICAgICA8L2Rpdj5gKVxyXG5cclxuY29uc3QgYWRkRXZlbnRUb1JlbW92ZUJ1dHRvbiA9IChyZW1vdmVCdXR0b246IEpRdWVyeSwgc2F2ZVZhbHVlOiBTYXZlVmFsdWVUeXBlLCB1cGxvYWRBcmVhOiBKUXVlcnkpID0+IHtcclxuICBjb25zdCByZW1vdmVFdmVudEhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZSA9IGZpbmQoYCMke3NhdmVWYWx1ZS5pZH1gLCB1cGxvYWRBcmVhKVxyXG5cclxuICAgIHJlbW92ZShpbWFnZSlcclxuICAgIGltYWdlUXVldWUgPSBpbWFnZVF1ZXVlLmZpbHRlcigoaW1nRGF0YTogU2F2ZVZhbHVlVHlwZSkgPT4gc2F2ZVZhbHVlLmlkICE9PSBpbWdEYXRhLmlkKVxyXG5cclxuICAgIGlmIChpbWFnZVF1ZXVlLmxlbmd0aCkgcmV0dXJuXHJcbiAgICBhZGRDbGFzcyh1cGxvYWRBcmVhLCAnaGlkZGVuJylcclxuICB9XHJcbiAgb24ocmVtb3ZlQnV0dG9uLCAnY2xpY2snLCByZW1vdmVFdmVudEhhbmRsZXIpXHJcbn1cclxuXHJcbmNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKHNhdmVWYWx1ZTogU2F2ZVZhbHVlVHlwZSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgY29uc3QgZ2VuZXJhdGVGaWxlTmFtZSA9IChzYXZlVmFsdWU6IFNhdmVWYWx1ZVR5cGUpID0+IHtcclxuICAgIGNvbnN0IHsgdHlwZSwgbmFtZSwgaWQgfSA9IHNhdmVWYWx1ZVxyXG4gICAgY29uc3QgZmlsZUV4dGVuc2lvbjogc3RyaW5nID0gbmFtZT8uc3Vic3RyaW5nKG5hbWUubGFzdEluZGV4T2YoJy4nKSwgbmFtZS5sZW5ndGgpIHx8IHR5cGU/LnJlcGxhY2UoJ2ltYWdlLycsICcuJykgfHwgJy5qcGVnJ1xyXG4gICAgcmV0dXJuIGAke2lkfSR7ZmlsZUV4dGVuc2lvbn1gXHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgbmV3TmFtZSA9IGdlbmVyYXRlRmlsZU5hbWUoc2F2ZVZhbHVlKVxyXG4gICAgY29uc3QgY29tcHJlc3NlZEltYWdlID0gYXdhaXQgaW1hZ2VDb21wcmVzc2lvbihzYXZlVmFsdWUuZmlsZSBhcyBGaWxlLCB7IG1heFNpemVNQjogMS41LCB1c2VXZWJXb3JrZXI6IHRydWUsIGFsd2F5c0tlZXBSZXNvbHV0aW9uOiB0cnVlIH0pXHJcbiAgICBjb25zdCBuZXdJbWFnZSA9IG5ldyBGaWxlKFtjb21wcmVzc2VkSW1hZ2UgYXMgRmlsZV0sIG5ld05hbWUsIHsgdHlwZTogc2F2ZVZhbHVlLnR5cGUgfSlcclxuXHJcbiAgICBjb25zdCB1cGxvYWRMb2NhdGlvbiA9IGdldFNldHRpbmcoJ3VwbG9hZExvY2F0aW9uJylcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGNvbnN0IGltYWdlTG9jYXRpb24gPSBhd2FpdCBGaWxlUGlja2VySW1wbGVtZW50YXRpb24oKS51cGxvYWQoT1JJR0lOX0ZPTERFUiwgdXBsb2FkTG9jYXRpb24sIG5ld0ltYWdlLCB7fSwgeyBub3RpZnk6IGZhbHNlIH0pXHJcblxyXG4gICAgaWYgKCFpbWFnZUxvY2F0aW9uIHx8ICEoaW1hZ2VMb2NhdGlvbiBhcyBGaWxlUGlja2VyLlVwbG9hZFJldHVybik/LnBhdGgpIHJldHVybiBzYXZlVmFsdWUuaW1hZ2VTcmMgYXMgc3RyaW5nXHJcbiAgICByZXR1cm4gKGltYWdlTG9jYXRpb24gYXMgRmlsZVBpY2tlci5VcGxvYWRSZXR1cm4pPy5wYXRoXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmV0dXJuIHNhdmVWYWx1ZS5pbWFnZVNyYyBhcyBzdHJpbmdcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGFkZEltYWdlVG9RdWV1ZSA9IGFzeW5jIChzYXZlVmFsdWU6IFNhdmVWYWx1ZVR5cGUsIHNpZGViYXI6IEpRdWVyeSkgPT4ge1xyXG4gIGNvbnN0IHVwbG9hZGluZ1N0YXRlcyA9IGdldFVwbG9hZGluZ1N0YXRlcyhzaWRlYmFyKVxyXG5cclxuICB1cGxvYWRpbmdTdGF0ZXMub24oKVxyXG4gIGNvbnN0IHVwbG9hZEFyZWE6IEpRdWVyeSA9IGZpbmQoJyNjaS1jaGF0LXVwbG9hZC1hcmVhJywgc2lkZWJhcilcclxuICBpZiAoIXVwbG9hZEFyZWEgfHwgIXVwbG9hZEFyZWFbMF0pIHJldHVyblxyXG5cclxuICBpZiAoc2F2ZVZhbHVlLmZpbGUpIHtcclxuICAgIGlmICghdXNlckNhblVwbG9hZCgpKSB7XHJcbiAgICAgIHVwbG9hZGluZ1N0YXRlcy5vZmYoKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHNhdmVWYWx1ZS5pbWFnZVNyYyA9IGF3YWl0IHVwbG9hZEltYWdlKHNhdmVWYWx1ZSlcclxuICB9XHJcblxyXG4gIGNvbnN0IGltYWdlUHJldmlldyA9IGNyZWF0ZUltYWdlUHJldmlldyhzYXZlVmFsdWUpXHJcbiAgaWYgKCFpbWFnZVByZXZpZXcgfHwgIWltYWdlUHJldmlld1swXSkgcmV0dXJuXHJcblxyXG4gIHJlbW92ZUNsYXNzKHVwbG9hZEFyZWEsICdoaWRkZW4nKVxyXG4gIGFwcGVuZCh1cGxvYWRBcmVhLCBpbWFnZVByZXZpZXcpXHJcbiAgaW1hZ2VRdWV1ZS5wdXNoKHNhdmVWYWx1ZSlcclxuXHJcbiAgY29uc3QgcmVtb3ZlQnV0dG9uID0gZmluZCgnLmNpLXJlbW92ZS1pbWFnZS1pY29uJywgaW1hZ2VQcmV2aWV3KVxyXG4gIGFkZEV2ZW50VG9SZW1vdmVCdXR0b24ocmVtb3ZlQnV0dG9uLCBzYXZlVmFsdWUsIHVwbG9hZEFyZWEpXHJcbiAgdXBsb2FkaW5nU3RhdGVzLm9mZigpXHJcbn1cclxuXHJcbmNvbnN0IGltYWdlc0ZpbGVSZWFkZXJIYW5kbGVyID0gKGZpbGU6IEZpbGUsIHNpZGViYXI6IEpRdWVyeSkgPT4gYXN5bmMgKGV2dDogRXZlbnQpID0+IHtcclxuICBjb25zdCBpbWFnZVNyYyA9IChldnQudGFyZ2V0IGFzIEZpbGVSZWFkZXIpPy5yZXN1bHRcclxuICBjb25zdCBzYXZlVmFsdWUgPSB7IHR5cGU6IGZpbGUudHlwZSwgbmFtZTogZmlsZS5uYW1lLCBpbWFnZVNyYywgaWQ6IHJhbmRvbVN0cmluZygpLCBmaWxlIH1cclxuICBhd2FpdCBhZGRJbWFnZVRvUXVldWUoc2F2ZVZhbHVlLCBzaWRlYmFyKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcHJvY2Vzc0ltYWdlRmlsZXMgPSAoZmlsZXM6IEZpbGVMaXN0IHwgRmlsZVtdLCBzaWRlYmFyOiBKUXVlcnkpID0+IHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBmaWxlOiBGaWxlID0gZmlsZXNbaV1cclxuICAgIGlmICghaXNGaWxlSW1hZ2UoZmlsZSkpIGNvbnRpbnVlXHJcblxyXG4gICAgY29uc3QgcmVhZGVyOiBGaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbWFnZXNGaWxlUmVhZGVySGFuZGxlcihmaWxlLCBzaWRlYmFyKSlcclxuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcHJvY2Vzc0Ryb3BBbmRQYXN0ZUltYWdlcyA9IChldmVudERhdGE6IERhdGFUcmFuc2Zlciwgc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgY29uc3QgZXh0cmFjdFVybEZyb21FdmVudERhdGEgPSAoZXZlbnREYXRhOiBEYXRhVHJhbnNmZXIpOiBzdHJpbmdbXSB8IG51bGwgPT4ge1xyXG4gICAgY29uc3QgaHRtbCA9IGV2ZW50RGF0YS5nZXREYXRhKCd0ZXh0L2h0bWwnKVxyXG4gICAgaWYgKCFodG1sKSByZXR1cm4gbnVsbFxyXG5cclxuICAgIGNvbnN0IGltYWdlcyA9IERPTV9QQVJTRVIucGFyc2VGcm9tU3RyaW5nKGh0bWwsICd0ZXh0L2h0bWwnKS5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKVxyXG4gICAgaWYgKCFpbWFnZXMgfHwgIWltYWdlcy5sZW5ndGgpIHJldHVybiBudWxsXHJcblxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgY29uc3QgaW1hZ2VVcmxzID0gWy4uLmltYWdlc10ubWFwKChpbWcpID0+IGltZy5zcmMgYXMgc3RyaW5nKVxyXG4gICAgY29uc3QgaW1hZ2VzQ29udGFpblJlc3RyaWN0ZWREb21haW5zID0gaW1hZ2VVcmxzLnNvbWUoKGl1KSA9PiBSRVNUUklDVEVEX0RPTUFJTlMuc29tZSgocmQpID0+IGl1LmluY2x1ZGVzKHJkKSkpXHJcbiAgICByZXR1cm4gaW1hZ2VzQ29udGFpblJlc3RyaWN0ZWREb21haW5zID8gbnVsbCA6IGltYWdlVXJsc1xyXG4gIH1cclxuICBjb25zdCB1cmxzRnJvbUV2ZW50RGF0YUhhbmRsZXIgPSBhc3luYyAodXJsczogc3RyaW5nW10pID0+IHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXJscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCB1cmwgPSB1cmxzW2ldXHJcbiAgICAgIGNvbnN0IHNhdmVWYWx1ZSA9IHsgaW1hZ2VTcmM6IHVybCwgaWQ6IHJhbmRvbVN0cmluZygpIH1cclxuICAgICAgYXdhaXQgYWRkSW1hZ2VUb1F1ZXVlKHNhdmVWYWx1ZSwgc2lkZWJhcilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHVybHM6IHN0cmluZ1tdIHwgbnVsbCA9IGV4dHJhY3RVcmxGcm9tRXZlbnREYXRhKGV2ZW50RGF0YSlcclxuICBpZiAodXJscyAmJiB1cmxzLmxlbmd0aCkgcmV0dXJuIHVybHNGcm9tRXZlbnREYXRhSGFuZGxlcih1cmxzKVxyXG5cclxuICBjb25zdCBleHRyYWN0RmlsZXNGcm9tRXZlbnREYXRhID0gKGV2ZW50RGF0YTogRGF0YVRyYW5zZmVyKTogRmlsZVtdID0+IHtcclxuICAgIGNvbnN0IGl0ZW1zOiBEYXRhVHJhbnNmZXJJdGVtTGlzdCA9IGV2ZW50RGF0YS5pdGVtc1xyXG4gICAgY29uc3QgZmlsZXMgPSBbXVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBpdGVtOiBEYXRhVHJhbnNmZXJJdGVtID0gaXRlbXNbaV1cclxuICAgICAgaWYgKCFpc0ZpbGVJbWFnZShpdGVtKSkgY29udGludWVcclxuXHJcbiAgICAgIGNvbnN0IGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpXHJcbiAgICAgIGlmICghZmlsZSkgY29udGludWVcclxuXHJcbiAgICAgIGZpbGVzLnB1c2goZmlsZSlcclxuICAgIH1cclxuICAgIHJldHVybiBmaWxlc1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZmlsZXM6IEZpbGVbXSA9IGV4dHJhY3RGaWxlc0Zyb21FdmVudERhdGEoZXZlbnREYXRhKVxyXG4gIGlmIChmaWxlcyAmJiBmaWxlcy5sZW5ndGgpIHJldHVybiBwcm9jZXNzSW1hZ2VGaWxlcyhmaWxlcywgc2lkZWJhcilcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEltYWdlUXVldWUgPSAoKTogU2F2ZVZhbHVlVHlwZVtdID0+IGltYWdlUXVldWVcclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVBbGxGcm9tUXVldWUgPSAoc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgd2hpbGUgKGltYWdlUXVldWUubGVuZ3RoKSB7XHJcbiAgICBjb25zdCBpbWFnZURhdGE6IFNhdmVWYWx1ZVR5cGUgfCB1bmRlZmluZWQgPSBpbWFnZVF1ZXVlLnBvcCgpXHJcbiAgICBpZiAoIWltYWdlRGF0YSkgY29udGludWVcclxuXHJcbiAgICBjb25zdCBpbWFnZUVsZW1lbnQgPSBmaW5kKGAjJHtpbWFnZURhdGEuaWR9YCwgc2lkZWJhcilcclxuICAgIHJlbW92ZShpbWFnZUVsZW1lbnQpXHJcbiAgfVxyXG5cclxuICBjb25zdCB1cGxvYWRBcmVhOiBKUXVlcnkgPSBmaW5kKCcjY2ktY2hhdC11cGxvYWQtYXJlYScsIHNpZGViYXIpXHJcbiAgYWRkQ2xhc3ModXBsb2FkQXJlYSwgJ2hpZGRlbicpXHJcbn1cclxuIiwiaW1wb3J0IHthZGRDbGFzcywgYXBwZW5kLCBjcmVhdGUsIGZpbmQsIG9uLCB0cmlnZ2VyfSBmcm9tICcuLi91dGlscy9KcXVlcnlXcmFwcGVycydcclxuaW1wb3J0IHt0LCB1c2VyQ2FuVXBsb2FkfSBmcm9tICcuLi91dGlscy9VdGlscydcclxuaW1wb3J0IHtwcm9jZXNzSW1hZ2VGaWxlc30gZnJvbSAnLi4vcHJvY2Vzc29ycy9GaWxlUHJvY2Vzc29yJ1xyXG5pbXBvcnQge2dldFNldHRpbmd9IGZyb20gJy4uL3V0aWxzL1NldHRpbmdzJ1xyXG5cclxuY29uc3QgY3JlYXRlVXBsb2FkQnV0dG9uID0gKCk6IEpRdWVyeSA9PiBjcmVhdGUoYDxhIGlkPVwiY2ktdXBsb2FkLWltYWdlXCIgdGl0bGU9XCIke3QoJ3VwbG9hZEJ1dHRvblRpdGxlJyl9XCI+PGkgY2xhc3M9XCJmYXMgZmEtaW1hZ2VzXCI+PC9pPjwvYT5gKVxyXG5cclxuY29uc3QgY3JlYXRlSGlkZGVuVXBsb2FkSW5wdXQgPSAoKTogSlF1ZXJ5ID0+IGNyZWF0ZShgPGlucHV0IHR5cGU9XCJmaWxlXCIgbXVsdGlwbGUgYWNjZXB0PVwiaW1hZ2UvKlwiIGlkPVwiY2ktdXBsb2FkLWltYWdlLWhpZGRlbi1pbnB1dFwiPmApXHJcblxyXG5jb25zdCBzZXR1cEV2ZW50cyA9ICh1cGxvYWRCdXR0b246IEpRdWVyeSwgaGlkZGVuVXBsb2FkSW5wdXQ6IEpRdWVyeSwgc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgY29uc3QgaGlkZGVuVXBsb2FkSW5wdXRDaGFuZ2VFdmVudEhhbmRsZXIgPSAoZXZ0OiBFdmVudCkgPT4ge1xyXG4gICAgY29uc3QgY3VycmVudFRhcmdldDogSFRNTElucHV0RWxlbWVudCA9IGV2dC5jdXJyZW50VGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICAgIGNvbnN0IGZpbGVzOiBGaWxlTGlzdCB8IG51bGwgPSBjdXJyZW50VGFyZ2V0LmZpbGVzXHJcbiAgICBpZiAoIWZpbGVzKSByZXR1cm5cclxuXHJcbiAgICBwcm9jZXNzSW1hZ2VGaWxlcyhmaWxlcywgc2lkZWJhcilcclxuICAgIGN1cnJlbnRUYXJnZXQudmFsdWUgPSAnJ1xyXG4gIH1cclxuICBjb25zdCB1cGxvYWRCdXR0b25DbGlja0V2ZW50SGFuZGxlciA9IChldnQ6IEV2ZW50KSA9PiB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgdHJpZ2dlcihoaWRkZW5VcGxvYWRJbnB1dCwgJ2NsaWNrJylcclxuICB9XHJcblxyXG4gIG9uKGhpZGRlblVwbG9hZElucHV0LCAnY2hhbmdlJywgaGlkZGVuVXBsb2FkSW5wdXRDaGFuZ2VFdmVudEhhbmRsZXIpXHJcbiAgb24odXBsb2FkQnV0dG9uLCAnY2xpY2snLCB1cGxvYWRCdXR0b25DbGlja0V2ZW50SGFuZGxlcilcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRVcGxvYWRCdXR0b24gPSAoc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgaWYgKCFnZXRTZXR0aW5nKCd1cGxvYWRCdXR0b24nKSkgcmV0dXJuXHJcblxyXG4gIGNvbnN0IGNvbnRyb2xCdXR0b25zOiBKUXVlcnkgPSBmaW5kKCcuY29udHJvbC1idXR0b25zJywgc2lkZWJhcilcclxuICBjb25zdCB1cGxvYWRCdXR0b246IEpRdWVyeSA9IGNyZWF0ZVVwbG9hZEJ1dHRvbigpXHJcbiAgY29uc3QgaGlkZGVuVXBsb2FkSW5wdXQ6IEpRdWVyeSA9IGNyZWF0ZUhpZGRlblVwbG9hZElucHV0KClcclxuXHJcbiAgaWYgKCF1c2VyQ2FuVXBsb2FkKHRydWUpKSByZXR1cm5cclxuXHJcbiAgaWYgKGNvbnRyb2xCdXR0b25zWzBdKSB7XHJcbiAgICBhZGRDbGFzcyhjb250cm9sQnV0dG9ucywgJ2NpLWNvbnRyb2wtYnV0dG9ucy1nbScpXHJcbiAgICBhcHBlbmQoY29udHJvbEJ1dHRvbnMsIHVwbG9hZEJ1dHRvbilcclxuICAgIGFwcGVuZChjb250cm9sQnV0dG9ucywgaGlkZGVuVXBsb2FkSW5wdXQpXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFBsYXllcnMgZG9uJ3QgaGF2ZSBidXR0b25zXHJcbiAgICBjb25zdCBjaGF0Q29udHJvbHM6IEpRdWVyeSA9IGZpbmQoJyNjaGF0LWNvbnRyb2xzJywgc2lkZWJhcilcclxuICAgIGNvbnN0IG5ld0NvbnRyb2xCdXR0b25zID0gY3JlYXRlKCc8ZGl2IGNsYXNzPVwiY2ktY29udHJvbC1idXR0b25zLXBcIj48L2Rpdj4nKVxyXG5cclxuICAgIGFwcGVuZChuZXdDb250cm9sQnV0dG9ucywgdXBsb2FkQnV0dG9uKVxyXG4gICAgYXBwZW5kKG5ld0NvbnRyb2xCdXR0b25zLCBoaWRkZW5VcGxvYWRJbnB1dClcclxuICAgIGFwcGVuZChjaGF0Q29udHJvbHMsIG5ld0NvbnRyb2xCdXR0b25zKVxyXG4gIH1cclxuXHJcbiAgc2V0dXBFdmVudHModXBsb2FkQnV0dG9uLCBoaWRkZW5VcGxvYWRJbnB1dCwgc2lkZWJhcilcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgZmluZCwgb24gfSBmcm9tICcuLi91dGlscy9KcXVlcnlXcmFwcGVycydcclxuaW1wb3J0IHsgZ2V0SW1hZ2VRdWV1ZSwgcHJvY2Vzc0Ryb3BBbmRQYXN0ZUltYWdlcywgcmVtb3ZlQWxsRnJvbVF1ZXVlLCBTYXZlVmFsdWVUeXBlIH0gZnJvbSAnLi4vcHJvY2Vzc29ycy9GaWxlUHJvY2Vzc29yJ1xyXG5pbXBvcnQgeyBpc1Zlcmlvc25BZnRlcjEzLCB0IH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnXHJcbmltcG9ydCB7IGdldFVwbG9hZGluZ1N0YXRlcyB9IGZyb20gJy4vTG9hZGVyJ1xyXG5cclxubGV0IGhvb2tJc0hhbmRsaW5nVGhlTWVzc2FnZSA9IGZhbHNlXHJcbmxldCBldmVudElzSGFuZGxpbmdUaGVNZXNzYWdlID0gZmFsc2VcclxuXHJcbmNvbnN0IGltYWdlVGVtcGxhdGUgPSAoaW1hZ2VQcm9wczogU2F2ZVZhbHVlVHlwZSk6IHN0cmluZyA9PiBgPGRpdiBjbGFzcz1cImNpLW1lc3NhZ2UtaW1hZ2VcIj48aW1nIHNyYz1cIiR7aW1hZ2VQcm9wcy5pbWFnZVNyY31cIiBhbHQ9XCIke2ltYWdlUHJvcHMubmFtZSB8fCB0KCd1bmFibGVUb0xvYWRJbWFnZScpfVwiPjwvZGl2PmBcclxuXHJcbmNvbnN0IG1lc3NhZ2VUZW1wbGF0ZSA9IChpbWFnZVF1ZXVlOiBTYXZlVmFsdWVUeXBlW10pID0+IHtcclxuICBjb25zdCBpbWFnZVRlbXBsYXRlczogc3RyaW5nW10gPSBpbWFnZVF1ZXVlLm1hcCgoaW1hZ2VQcm9wczogU2F2ZVZhbHVlVHlwZSk6IHN0cmluZyA9PiBpbWFnZVRlbXBsYXRlKGltYWdlUHJvcHMpKVxyXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cImNpLW1lc3NhZ2VcIj4ke2ltYWdlVGVtcGxhdGVzLmpvaW4oJycpfTwvZGl2PmBcclxufVxyXG5cclxuY29uc3QgcHJlQ3JlYXRlQ2hhdE1lc3NhZ2VIYW5kbGVyID0gKHNpZGViYXI6IEpRdWVyeSkgPT4gKGNoYXRNZXNzYWdlOiBhbnksIHVzZXJPcHRpb25zOiBuZXZlciwgbWVzc2FnZU9wdGlvbnM6IGFueSkgPT4ge1xyXG4gIGlmIChldmVudElzSGFuZGxpbmdUaGVNZXNzYWdlKSByZXR1cm5cclxuXHJcbiAgaG9va0lzSGFuZGxpbmdUaGVNZXNzYWdlID0gdHJ1ZVxyXG4gIGNvbnN0IGltYWdlUXVldWU6IFNhdmVWYWx1ZVR5cGVbXSA9IGdldEltYWdlUXVldWUoKVxyXG4gIGlmICghaW1hZ2VRdWV1ZS5sZW5ndGgpIHtcclxuICAgIGhvb2tJc0hhbmRsaW5nVGhlTWVzc2FnZSA9IGZhbHNlXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIGNvbnN0IHVwbG9hZFN0YXRlID0gZ2V0VXBsb2FkaW5nU3RhdGVzKHNpZGViYXIpXHJcbiAgdXBsb2FkU3RhdGUub24oKVxyXG5cclxuICBjb25zdCBjb250ZW50ID0gYCR7bWVzc2FnZVRlbXBsYXRlKGltYWdlUXVldWUpfTxkaXYgY2xhc3M9XCJjaS1ub3Rlc1wiPiR7Y2hhdE1lc3NhZ2UuY29udGVudH08L2Rpdj5gXHJcblxyXG4gIGNoYXRNZXNzYWdlLmNvbnRlbnQgPSBjb250ZW50XHJcbiAgY2hhdE1lc3NhZ2UuX3NvdXJjZS5jb250ZW50ID0gY29udGVudFxyXG4gIG1lc3NhZ2VPcHRpb25zLmNoYXRCdWJibGUgPSBmYWxzZVxyXG5cclxuICByZW1vdmVBbGxGcm9tUXVldWUoc2lkZWJhcilcclxuICBob29rSXNIYW5kbGluZ1RoZU1lc3NhZ2UgPSBmYWxzZVxyXG4gIHVwbG9hZFN0YXRlLm9mZigpXHJcbn1cclxuXHJcbmNvbnN0IGVtcHR5Q2hhdEV2ZW50SGFuZGxlciA9IChzaWRlYmFyOiBKUXVlcnkpID0+IGFzeW5jIChldnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICBpZiAoaG9va0lzSGFuZGxpbmdUaGVNZXNzYWdlIHx8IChldnQuY29kZSAhPT0gJ0VudGVyJyAmJiBldnQuY29kZSAhPT0gJ051bXBhZEVudGVyJykgfHwgZXZ0LnNoaWZ0S2V5KSByZXR1cm5cclxuICBldmVudElzSGFuZGxpbmdUaGVNZXNzYWdlID0gdHJ1ZVxyXG5cclxuICBjb25zdCB1cGxvYWRTdGF0ZSA9IGdldFVwbG9hZGluZ1N0YXRlcyhzaWRlYmFyKVxyXG4gIGNvbnN0IGltYWdlUXVldWU6IFNhdmVWYWx1ZVR5cGVbXSA9IGdldEltYWdlUXVldWUoKVxyXG4gIGlmICghaW1hZ2VRdWV1ZS5sZW5ndGgpIHtcclxuICAgIGV2ZW50SXNIYW5kbGluZ1RoZU1lc3NhZ2UgPSBmYWxzZVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHVwbG9hZFN0YXRlLm9uKClcclxuXHJcbiAgY29uc3QgY2hhdE1lc3NhZ2VUeXBlID0gaXNWZXJpb3NuQWZ0ZXIxMygpXHJcbiAgICA/IENPTlNULkNIQVRfTUVTU0FHRV9TVFlMRVMuT09DXHJcbiAgICA6IENPTlNULkNIQVRfTUVTU0FHRV9UWVBFUy5PT0NcclxuXHJcbiAgY29uc3QgbWVzc2FnZURhdGEgPSB7XHJcbiAgICBjb250ZW50OiBtZXNzYWdlVGVtcGxhdGUoaW1hZ2VRdWV1ZSksXHJcbiAgICB0eXBlOiB0eXBlb2YgY2hhdE1lc3NhZ2VUeXBlICE9PSAndW5kZWZpbmVkJyA/IGNoYXRNZXNzYWdlVHlwZSA6IDEsXHJcbiAgICB1c2VyOiAoZ2FtZSBhcyBHYW1lKS51c2VyLFxyXG4gIH1cclxuICBhd2FpdCBDaGF0TWVzc2FnZS5jcmVhdGUobWVzc2FnZURhdGEpXHJcbiAgcmVtb3ZlQWxsRnJvbVF1ZXVlKHNpZGViYXIpXHJcbiAgdXBsb2FkU3RhdGUub2ZmKClcclxuICBldmVudElzSGFuZGxpbmdUaGVNZXNzYWdlID0gZmFsc2VcclxufVxyXG5cclxuY29uc3QgcGFzdEFuZERyb3BFdmVudEhhbmRsZXIgPSAoc2lkZWJhcjogSlF1ZXJ5KSA9PiAoZXZ0OiBhbnkpID0+IHtcclxuICBjb25zdCBvcmlnaW5hbEV2ZW50OiBDbGlwYm9hcmRFdmVudCB8IERyYWdFdmVudCA9IGV2dC5vcmlnaW5hbEV2ZW50XHJcbiAgY29uc3QgZXZlbnREYXRhOiBEYXRhVHJhbnNmZXIgfCBudWxsID0gKG9yaWdpbmFsRXZlbnQgYXMgQ2xpcGJvYXJkRXZlbnQpLmNsaXBib2FyZERhdGEgfHwgKG9yaWdpbmFsRXZlbnQgYXMgRHJhZ0V2ZW50KS5kYXRhVHJhbnNmZXJcclxuICBpZiAoIWV2ZW50RGF0YSkgcmV0dXJuXHJcblxyXG4gIHByb2Nlc3NEcm9wQW5kUGFzdGVJbWFnZXMoZXZlbnREYXRhLCBzaWRlYmFyKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaXNVcGxvYWRBcmVhUmVuZGVyZWQgPSAoc2lkZWJhcjogSlF1ZXJ5KTogYm9vbGVhbiA9PiB7XHJcbiAgY29uc3QgdXBsb2FkQXJlYSA9IGZpbmQoJyNjaS1jaGF0LXVwbG9hZC1hcmVhJywgc2lkZWJhcilcclxuICByZXR1cm4gISF1cGxvYWRBcmVhLmxlbmd0aDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRDaGF0U2lkZWJhciA9IChzaWRlYmFyOiBKUXVlcnkpID0+IHtcclxuICBIb29rcy5vbigncHJlQ3JlYXRlQ2hhdE1lc3NhZ2UnLCBwcmVDcmVhdGVDaGF0TWVzc2FnZUhhbmRsZXIoc2lkZWJhcikpXHJcblxyXG4gIC8vIFRoaXMgc2hvdWxkIG9ubHkgcnVuIHdoZW4gdGhlcmUgaXMgbm90aGluZyBpbiB0aGUgY2hhdFxyXG4gIG9uKHNpZGViYXIsICdrZXl1cCcsIGVtcHR5Q2hhdEV2ZW50SGFuZGxlcihzaWRlYmFyKSlcclxuXHJcbiAgb24oc2lkZWJhciwgJ3Bhc3RlIGRyb3AnLCBwYXN0QW5kRHJvcEV2ZW50SGFuZGxlcihzaWRlYmFyKSlcclxufVxyXG4iLCJpbXBvcnQgeyBmaW5kLCBvbiB9IGZyb20gJy4uL3V0aWxzL0pxdWVyeVdyYXBwZXJzJ1xyXG5pbXBvcnQgeyBJbWFnZVBvcG91dEltcGxlbWVudGF0aW9uLCBpc1Zlcmlvc25BZnRlcjEzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnXHJcblxyXG5leHBvcnQgY29uc3QgaW5pdENoYXRNZXNzYWdlID0gKGNoYXRNZXNzYWdlOiBKUXVlcnkpID0+IHtcclxuICBjb25zdCBpbWFnZXMgPSBmaW5kKCcuY2ktbWVzc2FnZS1pbWFnZSBpbWcnLCBjaGF0TWVzc2FnZSlcclxuICBpZiAoIWltYWdlc1swXSkgcmV0dXJuXHJcblxyXG4gIGNvbnN0IGNsaWNrSW1hZ2VIYW5kbGUgPSAoZXZ0OiBFdmVudCkgPT4ge1xyXG4gICAgY29uc3Qgc3JjID0gKGV2dC50YXJnZXQgYXMgSFRNTEltYWdlRWxlbWVudCkuc3JjXHJcbiAgICBjb25zdCBpbWFnZVBvcHVwID0gSW1hZ2VQb3BvdXRJbXBsZW1lbnRhdGlvbigpXHJcblxyXG4gICAgaWYgKGlzVmVyaW9zbkFmdGVyMTMoKSkge1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIG5ldyBpbWFnZVBvcHVwKHsgc3JjLCBlZGl0YWJsZTogZmFsc2UsIHNoYXJlYWJsZTogdHJ1ZSB9KS5yZW5kZXIodHJ1ZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgbmV3IGltYWdlUG9wdXAoc3JjLCB7IGVkaXRhYmxlOiBmYWxzZSwgc2hhcmVhYmxlOiB0cnVlIH0pLnJlbmRlcih0cnVlKVxyXG4gICAgfVxyXG4gIH1cclxuICBvbihpbWFnZXMsICdjbGljaycsIGNsaWNrSW1hZ2VIYW5kbGUpXHJcbn1cclxuIiwiaW1wb3J0IHt0fSBmcm9tICcuLi91dGlscy9VdGlscydcclxuXHJcbmNvbnN0IGltYWdlTWFya2Rvd25SZWcgPSAvIVxccypjaVxccypcXHxcXHMqKC4rPylcXHMqIS9naVxyXG5jb25zdCBpbWFnZVJlZyA9IC9cXHcrXFwuKGdpZnxwbmd8anBnfGpwZWd8d2VicHxzdmd8cHNkfGJtcHx0aWYpL2dpXHJcblxyXG5jb25zdCBpbWFnZVRlbXBsYXRlID0gKHNyYzogc3RyaW5nKTogc3RyaW5nID0+IGA8ZGl2IGNsYXNzPVwiY2ktbWVzc2FnZS1pbWFnZVwiPjxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiJHt0KCd1bmFibGVUb0xvYWRJbWFnZScpfVwiPjwvZGl2PmBcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9jZXNzTWVzc2FnZSA9IChtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gIGlmICghbWVzc2FnZS5tYXRjaChpbWFnZU1hcmtkb3duUmVnKSkgcmV0dXJuIG1lc3NhZ2VcclxuXHJcbiAgcmV0dXJuIG1lc3NhZ2UucmVwbGFjZUFsbChpbWFnZU1hcmtkb3duUmVnLCAobTogc3RyaW5nLCBzcmM6IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKCFzcmMubWF0Y2goaW1hZ2VSZWcpKSByZXR1cm4gbVxyXG4gICAgcmV0dXJuIGltYWdlVGVtcGxhdGUoc3JjKVxyXG4gIH0pXHJcbn1cclxuIiwiaW1wb3J0ICcuL3N0eWxlcy9jaGF0LWltYWdlcy5zY3NzJ1xyXG5pbXBvcnQgeyBpbml0VXBsb2FkQXJlYSB9IGZyb20gJy4vc2NyaXB0cy9jb21wb25lbnRzL1VwbG9hZEFyZWEnXHJcbmltcG9ydCB7IGluaXRVcGxvYWRCdXR0b24gfSBmcm9tICcuL3NjcmlwdHMvY29tcG9uZW50cy9VcGxvYWRCdXR0b24nXHJcbmltcG9ydCB7IGluaXRDaGF0U2lkZWJhciwgaXNVcGxvYWRBcmVhUmVuZGVyZWQgfSBmcm9tICcuL3NjcmlwdHMvY29tcG9uZW50cy9DaGF0U2lkZWJhcidcclxuaW1wb3J0IHsgaW5pdENoYXRNZXNzYWdlIH0gZnJvbSAnLi9zY3JpcHRzL2NvbXBvbmVudHMvQ2hhdE1lc3NhZ2UnXHJcbmltcG9ydCB7IGNyZWF0ZSwgZmluZCB9IGZyb20gJy4vc2NyaXB0cy91dGlscy9KcXVlcnlXcmFwcGVycydcclxuaW1wb3J0IHsgcHJvY2Vzc01lc3NhZ2UgfSBmcm9tICcuL3NjcmlwdHMvcHJvY2Vzc29ycy9NZXNzYWdlUHJvY2Vzc29yJ1xyXG5pbXBvcnQgeyBjcmVhdGVVcGxvYWRGb2xkZXIsIGdldFNldHRpbmdzLCByZWdpc3RlclNldHRpbmcgfSBmcm9tICcuL3NjcmlwdHMvdXRpbHMvU2V0dGluZ3MnXHJcbmltcG9ydCB7IGlzVmVyaW9zbkFmdGVyMTMgfSBmcm9tICcuL3NjcmlwdHMvdXRpbHMvVXRpbHMnXHJcblxyXG5jb25zdCByZWdpc3RlclNldHRpbmdzID0gKCkgPT4ge1xyXG4gIGNvbnN0IHNldHRpbmdzID0gZ2V0U2V0dGluZ3MoKVxyXG4gIHNldHRpbmdzLmZvckVhY2goKHNldHRpbmcpID0+IHJlZ2lzdGVyU2V0dGluZyhzZXR0aW5nKSlcclxufVxyXG5cclxuSG9va3Mub25jZSgnaW5pdCcsIGFzeW5jICgpID0+IHtcclxuICByZWdpc3RlclNldHRpbmdzKClcclxuICByZWdpc3Rlckhvb2tzKClcclxuXHJcbiAgYXdhaXQgY3JlYXRlVXBsb2FkRm9sZGVyKClcclxufSlcclxuXHJcbmNvbnN0IHJlZ2lzdGVySG9va3MgPSAoKSA9PiB7XHJcbiAgaWYgKGlzVmVyaW9zbkFmdGVyMTMoKSkge1xyXG4gICAgSG9va3Mub24oJ3JlbmRlckNoYXRNZXNzYWdlSFRNTCcsIChfMDogbmV2ZXIsIGNoYXRNZXNzYWdlRWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgY29uc3QgY2hhdE1lc3NhZ2UgPSBjcmVhdGUoY2hhdE1lc3NhZ2VFbGVtZW50KVxyXG5cclxuICAgICAgY29uc3QgY2lNZXNzYWdlID0gZmluZCgnLmNpLW1lc3NhZ2UtaW1hZ2UnLCBjaGF0TWVzc2FnZSlcclxuICAgICAgaWYgKCFjaU1lc3NhZ2VbMF0pIHJldHVyblxyXG5cclxuICAgICAgaW5pdENoYXRNZXNzYWdlKGNoYXRNZXNzYWdlKVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCBpbml0RXZlbnRzID0gKHNpZGViYXI6IEpRdWVyeSkgPT4ge1xyXG4gICAgICAvLyBQcmV2ZW50IGFkZGluZyBldmVudHMgbXVsdGlwbGUgdGltZXNcclxuICAgICAgaWYgKGlzVXBsb2FkQXJlYVJlbmRlcmVkKHNpZGViYXIpKSByZXR1cm5cclxuXHJcbiAgICAgIGluaXRVcGxvYWRBcmVhKHNpZGViYXIpXHJcbiAgICAgIC8vIFJlbW92ZWQgaW4gdmVyc2lvbiAxMyBcclxuICAgICAgLy8gaW5pdFVwbG9hZEJ1dHRvbihzaWRlYmFyKVxyXG4gICAgICBpbml0Q2hhdFNpZGViYXIoc2lkZWJhcilcclxuICAgIH1cclxuXHJcbiAgICBIb29rcy5vbignY29sbGFwc2VTaWRlYmFyJywgKHNpZGViYXI6IGFueSwgY29sbGFwc2VkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgIGlmICghc2lkZWJhciB8fCBjb2xsYXBzZWQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3Qgc2lkZWJhckVsZW1lbnQgPSBzaWRlYmFyLmVsZW1lbnRcclxuICAgICAgaWYgKCFzaWRlYmFyRWxlbWVudCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBoYXNDaGF0RWxlbWVudCA9IHNpZGViYXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGF0LW1lc3NhZ2UnKVxyXG4gICAgICBpZiAoIWhhc0NoYXRFbGVtZW50KSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHNpZGViYXJKcSA9ICQoc2lkZWJhckVsZW1lbnQpXHJcbiAgICAgIGluaXRFdmVudHMoc2lkZWJhckpxKVxyXG4gICAgfSlcclxuXHJcbiAgICBIb29rcy5vbignYWN0aXZhdGVDaGF0TG9nJywgKGNoYXRMb2c6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoIWNoYXRMb2cpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgY2hhdExvZ0VsZW1lbnQgPSBjaGF0TG9nLmVsZW1lbnRcclxuICAgICAgaWYgKCFjaGF0TG9nRWxlbWVudCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBoYXNDaGF0RWxlbWVudCA9IGNoYXRMb2dFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGF0LW1lc3NhZ2UnKVxyXG4gICAgICBpZiAoIWhhc0NoYXRFbGVtZW50KSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IGNoYXRMb2dKcSA9ICQoY2hhdExvZ0VsZW1lbnQpXHJcbiAgICAgIGluaXRFdmVudHMoY2hhdExvZ0pxKVxyXG4gICAgfSlcclxuICB9IGVsc2Uge1xyXG4gICAgSG9va3Mub24oJ3JlbmRlckNoYXRNZXNzYWdlJywgKF8wOiBuZXZlciwgY2hhdE1lc3NhZ2U6IEpRdWVyeSkgPT4ge1xyXG4gICAgICBjb25zdCBjaU1lc3NhZ2UgPSBmaW5kKCcuY2ktbWVzc2FnZS1pbWFnZScsIGNoYXRNZXNzYWdlKVxyXG4gICAgICBpZiAoIWNpTWVzc2FnZVswXSkgcmV0dXJuXHJcblxyXG4gICAgICBpbml0Q2hhdE1lc3NhZ2UoY2hhdE1lc3NhZ2UpXHJcbiAgICB9KVxyXG5cclxuICAgIEhvb2tzLm9uKCdyZW5kZXJTaWRlYmFyVGFiJywgKF8wOiBuZXZlciwgc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgICAgIGNvbnN0IHNpZGViYXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBzaWRlYmFyWzBdXHJcbiAgICAgIGlmICghc2lkZWJhckVsZW1lbnQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgaGFzQ2hhdEVsZW1lbnQgPSBzaWRlYmFyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhdC1tZXNzYWdlJylcclxuICAgICAgaWYgKCFoYXNDaGF0RWxlbWVudCkgcmV0dXJuXHJcblxyXG4gICAgICBpbml0VXBsb2FkQXJlYShzaWRlYmFyKVxyXG4gICAgICBpbml0VXBsb2FkQnV0dG9uKHNpZGViYXIpXHJcbiAgICAgIGluaXRDaGF0U2lkZWJhcihzaWRlYmFyKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIEhvb2tzLm9uKCdwcmVDcmVhdGVDaGF0TWVzc2FnZScsIChjaGF0TWVzc2FnZTogYW55LCB1c2VyT3B0aW9uczogbmV2ZXIsIG1lc3NhZ2VPcHRpb25zOiBhbnkpID0+IHtcclxuICAgIGNvbnN0IHByb2Nlc3NlZE1lc3NhZ2U6IHN0cmluZyA9IHByb2Nlc3NNZXNzYWdlKGNoYXRNZXNzYWdlLmNvbnRlbnQpXHJcbiAgICBpZiAoY2hhdE1lc3NhZ2UuY29udGVudCA9PT0gcHJvY2Vzc2VkTWVzc2FnZSkgcmV0dXJuXHJcblxyXG4gICAgY2hhdE1lc3NhZ2UuY29udGVudCA9IHByb2Nlc3NlZE1lc3NhZ2VcclxuICAgIGNoYXRNZXNzYWdlLl9zb3VyY2UuY29udGVudCA9IHByb2Nlc3NlZE1lc3NhZ2VcclxuICAgIG1lc3NhZ2VPcHRpb25zLmNoYXRCdWJibGUgPSBmYWxzZVxyXG4gIH0pXHJcbn1cclxuIl0sIm5hbWVzIjpbImNyZWF0ZSIsImh0bWwiLCJiZWZvcmUiLCJyZWZlcmVuY2VOb2RlIiwibmV3Tm9kZSIsImZpbmQiLCJzZWxlY3RvciIsInBhcmVudE5vZGUiLCJhcHBlbmQiLCJvbiIsImV2ZW50VHlwZSIsImV2ZW50RnVuY3Rpb24iLCJ0cmlnZ2VyIiwicmVtb3ZlQ2xhc3MiLCJjbGFzc1N0cmluZyIsImFkZENsYXNzIiwicmVtb3ZlIiwibm9kZSIsImF0dHIiLCJhdHRySWQiLCJhdHRyVmFsdWUiLCJyZW1vdmVBdHRyIiwiZm9jdXMiLCJPUklHSU5fRk9MREVSIiwidCIsInRleHQiLCJyYW5kb21TdHJpbmciLCJ1c2VyQ2FuVXBsb2FkIiwic2lsZW50IiwidXNlclJvbGUiLCJmaWxlVXBsb2FkUGVybWlzc2lvbnMiLCJ1cGxvYWRQZXJtaXNzaW9uIiwiZ2V0Rm91bmRyeVZlcnNpb24iLCJpc1Zlcmlvc25BZnRlcjEzIiwiRmlsZVBpY2tlckltcGxlbWVudGF0aW9uIiwiSW1hZ2VQb3BvdXRJbXBsZW1lbnRhdGlvbiIsImNyZWF0ZVVwbG9hZEFyZWEiLCJpbml0VXBsb2FkQXJlYSIsInNpZGViYXIiLCJjaGF0Q29udHJvbHNTZWxlY3RvciIsImNoYXRDb250cm9scyIsInVwbG9hZEFyZWEiLCJfbWVyZ2VOYW1lc3BhY2VzIiwiZSIsInIiLCJpIiwiY29weUV4aWZXaXRob3V0T3JpZW50YXRpb24iLCJvIiwiZ2V0QXBwMVNlZ21lbnQiLCJhIiwicyIsImYiLCJsIiwiYyIsIlVaSVAiLCJ1IiwiaCIsImQiLCJBIiwiZyIsInAiLCJtIiwiXyIsInciLCJiIiwieSIsIkUiLCJGIiwiQiIsIlUiLCJDIiwiSSIsIlEiLCJNIiwieCIsIlMiLCJSIiwiVCIsIk8iLCJQIiwiSCIsIkwiLCJwdXNoViIsIlVQTkciLCJkZWNvZGVJbWFnZSIsIl9nZXRCUFAiLCJ2IiwiX2RlY29tcHJlc3MiLCJfaW5mbGF0ZSIsIl9maWx0ZXJaZXJvIiwibiIsIl9wYWV0aCIsIl9JSERSIiwiX2NvcHlUaWxlIiwiYWRkRXJyIiwiTiIsIkQiLCJkaXRoZXIiLCJfbWFpbiIsImNvbXByZXNzUE5HIiwiY29tcHJlc3MiLCJfcHJlcGFyZURpZmYiLCJfdXBkYXRlRnJhbWUiLCJxdWFudGl6ZSIsIl9maWx0ZXJMaW5lIiwiZ2V0S0R0cmVlIiwiZ2V0TmVhcmVzdCIsInBsYW5lRHN0Iiwic3RhdHMiLCJlc3RhdHMiLCJzcGxpdFBpeGVscyIsInZlY0RvdCIsInNldDE2Iiwic2V0MzIiLCJzZWVrIiwiY29udmVydCIsIkN1c3RvbUZpbGUiLCJDdXN0b21GaWxlUmVhZGVyIiwiZ2V0RmlsZWZyb21EYXRhVXJsIiwiZ2V0RGF0YVVybEZyb21GaWxlIiwibG9hZEltYWdlIiwiZ2V0QnJvd3Nlck5hbWUiLCJhcHByb3hpbWF0ZUJlbG93TWF4aW11bUNhbnZhc1NpemVPZkJyb3dzZXIiLCJnZXROZXdDYW52YXNBbmRDdHgiLCJkcmF3SW1hZ2VJbkNhbnZhcyIsImlzSU9TIiwiZHJhd0ZpbGVJbkNhbnZhcyIsIiRUcnlfMl9Qb3N0IiwiJFRyeV8yX0NhdGNoIiwiJFRyeV8zX0NhdGNoIiwiY2FudmFzVG9GaWxlIiwiJElmXzQiLCIkSWZfNSIsIiRJZl82IiwiY2xlYW51cENhbnZhc01lbW9yeSIsImlzQXV0b09yaWVudGF0aW9uSW5Ccm93c2VyIiwiZ2V0RXhpZk9yaWVudGF0aW9uIiwiaGFuZGxlTWF4V2lkdGhPckhlaWdodCIsImZvbGxvd0V4aWZPcmllbnRhdGlvbiIsImluY1Byb2dyZXNzIiwic2V0UHJvZ3Jlc3MiLCIkSWZfMiIsIiRMb29wXzMiLCIkTG9vcF8zX2V4aXQiLCJjb21wcmVzc09uV2ViV29ya2VyIiwiaW1hZ2VDb21wcmVzc2lvbiIsIiRUcnlfMV9DYXRjaCIsInRvZ2dsZUNoYXQiLCJjaGF0IiwidG9nZ2xlIiwidG9nZ2xlU3Bpbm5lciIsImNoYXRGb3JtIiwic3Bpbm5lcklkIiwic3Bpbm5lciIsIm5ld1NwaW5uZXIiLCJnZXRVcGxvYWRpbmdTdGF0ZXMiLCJjaGF0Rm9ybVF1ZXJ5IiwiY3JlYXRlVXBsb2FkRm9sZGVyIiwidXBsb2FkTG9jYXRpb24iLCJsb2NhdGlvbiIsImdldFNldHRpbmciLCJzZXRTZXR0aW5nIiwia2V5IiwidmFsdWUiLCJnZXRTZXR0aW5ncyIsIm5ld1VwbG9hZExvY2F0aW9uIiwiZGVmYXVsdExvY2F0aW9uIiwic2hvdWxkQ2hhbmdlTG9jYXRpb24iLCJyZWdpc3RlclNldHRpbmciLCJzZXR0aW5nIiwiUkVTVFJJQ1RFRF9ET01BSU5TIiwiRE9NX1BBUlNFUiIsImltYWdlUXVldWUiLCJpc0ZpbGVJbWFnZSIsImZpbGUiLCJjcmVhdGVJbWFnZVByZXZpZXciLCJpbWFnZVNyYyIsImlkIiwiYWRkRXZlbnRUb1JlbW92ZUJ1dHRvbiIsInJlbW92ZUJ1dHRvbiIsInNhdmVWYWx1ZSIsImltYWdlIiwiaW1nRGF0YSIsInVwbG9hZEltYWdlIiwiZ2VuZXJhdGVGaWxlTmFtZSIsInR5cGUiLCJuYW1lIiwiZmlsZUV4dGVuc2lvbiIsIm5ld05hbWUiLCJjb21wcmVzc2VkSW1hZ2UiLCJuZXdJbWFnZSIsImltYWdlTG9jYXRpb24iLCJhZGRJbWFnZVRvUXVldWUiLCJ1cGxvYWRpbmdTdGF0ZXMiLCJpbWFnZVByZXZpZXciLCJpbWFnZXNGaWxlUmVhZGVySGFuZGxlciIsImV2dCIsInByb2Nlc3NJbWFnZUZpbGVzIiwiZmlsZXMiLCJyZWFkZXIiLCJwcm9jZXNzRHJvcEFuZFBhc3RlSW1hZ2VzIiwiZXZlbnREYXRhIiwiZXh0cmFjdFVybEZyb21FdmVudERhdGEiLCJpbWFnZXMiLCJpbWFnZVVybHMiLCJpbWciLCJpdSIsInJkIiwidXJsc0Zyb21FdmVudERhdGFIYW5kbGVyIiwidXJscyIsIml0ZW1zIiwiaXRlbSIsImdldEltYWdlUXVldWUiLCJyZW1vdmVBbGxGcm9tUXVldWUiLCJpbWFnZURhdGEiLCJpbWFnZUVsZW1lbnQiLCJjcmVhdGVVcGxvYWRCdXR0b24iLCJjcmVhdGVIaWRkZW5VcGxvYWRJbnB1dCIsInNldHVwRXZlbnRzIiwidXBsb2FkQnV0dG9uIiwiaGlkZGVuVXBsb2FkSW5wdXQiLCJoaWRkZW5VcGxvYWRJbnB1dENoYW5nZUV2ZW50SGFuZGxlciIsImN1cnJlbnRUYXJnZXQiLCJ1cGxvYWRCdXR0b25DbGlja0V2ZW50SGFuZGxlciIsImluaXRVcGxvYWRCdXR0b24iLCJjb250cm9sQnV0dG9ucyIsIm5ld0NvbnRyb2xCdXR0b25zIiwiaG9va0lzSGFuZGxpbmdUaGVNZXNzYWdlIiwiZXZlbnRJc0hhbmRsaW5nVGhlTWVzc2FnZSIsImltYWdlVGVtcGxhdGUiLCJpbWFnZVByb3BzIiwibWVzc2FnZVRlbXBsYXRlIiwicHJlQ3JlYXRlQ2hhdE1lc3NhZ2VIYW5kbGVyIiwiY2hhdE1lc3NhZ2UiLCJ1c2VyT3B0aW9ucyIsIm1lc3NhZ2VPcHRpb25zIiwidXBsb2FkU3RhdGUiLCJjb250ZW50IiwiZW1wdHlDaGF0RXZlbnRIYW5kbGVyIiwiY2hhdE1lc3NhZ2VUeXBlIiwibWVzc2FnZURhdGEiLCJwYXN0QW5kRHJvcEV2ZW50SGFuZGxlciIsIm9yaWdpbmFsRXZlbnQiLCJpc1VwbG9hZEFyZWFSZW5kZXJlZCIsImluaXRDaGF0U2lkZWJhciIsImluaXRDaGF0TWVzc2FnZSIsInNyYyIsImltYWdlUG9wdXAiLCJpbWFnZU1hcmtkb3duUmVnIiwiaW1hZ2VSZWciLCJwcm9jZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJyZWdpc3RlclNldHRpbmdzIiwicmVnaXN0ZXJIb29rcyIsIl8wIiwiY2hhdE1lc3NhZ2VFbGVtZW50IiwiaW5pdEV2ZW50cyIsImNvbGxhcHNlZCIsInNpZGViYXJFbGVtZW50Iiwic2lkZWJhckpxIiwiY2hhdExvZyIsImNoYXRMb2dFbGVtZW50IiwiY2hhdExvZ0pxIiwicHJvY2Vzc2VkTWVzc2FnZSJdLCJtYXBwaW5ncyI6IkFBQ08sTUFBTUEsS0FBUyxDQUFDQyxNQUF1QyxFQUFFQSxDQUFJLEdBQ3ZEQyxLQUFTLENBQUNDLEdBQXVCQyxNQUE0QkQsRUFBYyxPQUFPQyxDQUFPLEdBRXpGQyxLQUFPLENBQUNDLEdBQWtCQyxNQUFnQ0EsSUFBYUEsRUFBVyxLQUFLRCxDQUFRLElBQUksRUFBRUEsQ0FBUSxHQUM3R0UsS0FBUyxDQUFDRCxHQUFvQkgsTUFBNEJHLEVBQVcsT0FBT0gsQ0FBTyxHQUVuRkssS0FBSyxDQUFDRixHQUFvQkcsR0FBbUJDLE1BQW9DSixFQUFXLEdBQUdHLEdBQVdDLENBQWEsR0FDdkhDLEtBQVUsQ0FBQ0wsR0FBb0JHLE1BQThCSCxFQUFXLFFBQVFHLENBQVMsR0FDekZHLEtBQWMsQ0FBQ04sR0FBb0JPLE1BQWdDUCxFQUFXLFlBQVlPLENBQVcsR0FDckdDLEtB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R0FBRTtBQUFDLElBQUFBLE1BQUksSUFBRTtBQUFFLFFBQUlDLElBQUUsTUFBSTtBQUFFLE1BQUVBLENBQUMsS0FBR0QsR0FBRSxFQUFFQyxJQUFFLENBQUMsS0FBR0QsTUFBSSxHQUFFLEVBQUVDLElBQUUsQ0FBQyxLQUFHRCxNQUFJO0FBQUEsRUFBRSxHQUFFVSxFQUFLLEVBQUUsU0FBTyxTQUFTLEdBQUUsR0FBRVYsR0FBRTtBQUFDLFlBQU8sRUFBRSxNQUFJLENBQUMsSUFBRSxFQUFFLEtBQUcsTUFBSSxFQUFFLEtBQUcsUUFBTSxJQUFFLE1BQUksS0FBR0EsS0FBRztBQUFBLEVBQUMsR0FBRVUsRUFBSyxFQUFFLFNBQU8sU0FBUyxHQUFFLEdBQUVWLEdBQUU7QUFBQyxZQUFPLEVBQUUsTUFBSSxDQUFDLElBQUUsRUFBRSxLQUFHLE1BQUksRUFBRSxLQUFHLElBQUUsRUFBRSxLQUFHLE1BQUksRUFBRSxLQUFHLFNBQU8sSUFBRSxNQUFJLEtBQUdBLEtBQUc7QUFBQSxFQUFDLEdBQUVVLEVBQUssRUFBRSxTQUFPLFNBQVMsR0FBRSxHQUFFO0FBQUMsWUFBTyxFQUFFLE1BQUksQ0FBQyxJQUFFLEVBQUUsS0FBRyxNQUFJLEVBQUUsS0FBRyxJQUFFLEVBQUUsS0FBRyxNQUFJLEVBQUUsS0FBRyxTQUFPLElBQUU7QUFBQSxFQUFFLEdBQUVBLEVBQUssRUFBRSxTQUFPLFNBQVMsR0FBRSxHQUFFO0FBQUMsWUFBTyxFQUFFLE1BQUksQ0FBQyxJQUFFLEVBQUUsS0FBRyxNQUFJLEVBQUUsS0FBRyxJQUFFLEVBQUUsS0FBRyxNQUFJLEVBQUUsS0FBRyxLQUFHLEVBQUUsS0FBRyxNQUFJLEVBQUUsS0FBRyxTQUFPLElBQUU7QUFBQSxFQUFFLEdBQUVBLEVBQUssRUFBRSxLQUFHVixJQUFFLGFBQVlDLElBQUUsYUFBWSxFQUFDLFdBQVUsSUFBSUQsRUFBRSxFQUFFLEdBQUUsVUFBUyxJQUFJQSxFQUFFLEVBQUUsR0FBRSxNQUFLLENBQUMsSUFBRyxJQUFHLElBQUcsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLElBQUcsR0FBRSxJQUFHLEdBQUUsSUFBRyxHQUFFLElBQUcsR0FBRSxJQUFHLEdBQUUsRUFBRSxHQUFFLEtBQUksQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsS0FBSSxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxLQUFJLEdBQUcsR0FBRSxLQUFJLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsTUFBSyxJQUFJQSxFQUFFLEVBQUUsR0FBRSxLQUFJLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxLQUFJLE1BQUssTUFBSyxNQUFLLE1BQUssTUFBSyxNQUFLLE1BQUssT0FBTSxPQUFNLE9BQU0sT0FBTSxLQUFLLEdBQUUsS0FBSSxDQUFDLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLEdBQUUsQ0FBQyxHQUFFLE1BQUssSUFBSUMsRUFBRSxFQUFFLEdBQUUsT0FBTSxJQUFJRCxFQUFFLEdBQUcsR0FBRSxRQUFPLENBQUEsR0FBRyxPQUFNLElBQUlBLEVBQUUsRUFBRSxHQUFFLFFBQU8sQ0FBQSxHQUFHLE1BQUss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LEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxHQUFHLEdBQUUsR0FBRSxDQUFDLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLEdBQUUsSUFBSUEsRUFBRSxFQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxNQUFLLE1BQUssTUFBSyxNQUFLLE1BQUssTUFBSyxNQUFLLE9BQU0sT0FBTSxPQUFNLE9BQU0sS0FBSyxHQUFFLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxHQUFFLENBQUMsR0FBRSxHQUFFLElBQUluQixFQUFFLEVBQUUsR0FBRSxHQUFFLElBQUltQixFQUFFLEdBQUcsR0FBRSxHQUFFLENBQUEsR0FBRyxHQUFFLElBQUlBLEVBQUUsRUFBRSxHQUFFLEdBQUUsQ0FBQSxHQUFHLEdBQUUsSUFBSUEsRUFBRSxLQUFLLEdBQUUsR0FBRSxJQUFHLEdBQUUsQ0FBQSxHQUFHLEdBQUUsSUFBSUEsRUFBRSxLQUFLLEdBQUUsR0FBRSxDQUFBLEdBQUcsR0FBRSxJQUFJQSxFQUFFLEdBQUcsR0FBRSxHQUFFLENBQUEsR0FBRyxHQUFFLElBQUlBLEVBQUUsS0FBSyxHQUFFLEdBQUUsSUFBSW5CLEVBQUUsR0FBRyxHQUFFLEdBQUUsSUFBSUEsRUFBRSxFQUFFLEdBQUUsR0FBRSxJQUFJQSxFQUFFLEVBQUUsR0FBRSxHQUFFLElBQUlBLEVBQUUsSUFBSSxHQUFFLEdBQUUsSUFBSW1CLEVBQUUsS0FBSyxHQUFFLEdBQUUsSUFBSUEsRUFBRSxLQUFLLEVBQUM7QUFBQSxJQUFDLEdBQUMsSUFBRyxXQUFVO0FBQUMsWUFBTW5CLElBQUVtQixFQUFFLEVBQUU7QUFBRSxlQUFRQyxJQUFFLEdBQUVBLElBQUUsT0FBTUEsS0FBSTtBQUFDLFlBQUlELElBQUVDO0FBQUUsUUFBQUQsS0FBRyxhQUFXQSxPQUFLLEtBQUcsYUFBV0EsTUFBSSxHQUFFQSxLQUFHLGFBQVdBLE9BQUssS0FBRyxZQUFVQSxNQUFJLEdBQUVBLEtBQUcsYUFBV0EsT0FBSyxLQUFHLFlBQVVBLE1BQUksR0FBRUEsS0FBRyxhQUFXQSxPQUFLLEtBQUcsV0FBU0EsTUFBSSxHQUFFbkIsRUFBRSxFQUFFb0IsQ0FBQyxLQUFHRCxNQUFJLEtBQUdBLEtBQUcsUUFBTTtBQUFBLE1BQUU7QUFBQyxlQUFTK0MsRUFBRS9DLEdBQUVuQixHQUFFb0IsR0FBRTtBQUFDLGVBQVFwQixPQUFILElBQVEsQ0FBQW1CLEVBQUUsS0FBSyxHQUFFQyxDQUFDO0FBQUEsTUFBQztBQUFDLFdBQUlBLElBQUUsR0FBRUEsSUFBRSxJQUFHQSxJQUFJLENBQUFwQixFQUFFLEVBQUVvQixDQUFDLElBQUVwQixFQUFFLEVBQUVvQixDQUFDLEtBQUcsSUFBRXBCLEVBQUUsRUFBRW9CLENBQUMsR0FBRXBCLEVBQUUsRUFBRW9CLENBQUMsSUFBRXBCLEVBQUUsRUFBRW9CLENBQUMsS0FBRyxJQUFFcEIsRUFBRSxFQUFFb0IsQ0FBQztBQUFFLE1BQUE4QyxFQUFFbEUsRUFBRSxHQUFFLEtBQUksQ0FBQyxHQUFFa0UsRUFBRWxFLEVBQUUsR0FBRSxLQUFJLENBQUMsR0FBRWtFLEVBQUVsRSxFQUFFLEdBQUUsSUFBRyxDQUFDLEdBQUVrRSxFQUFFbEUsRUFBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFbUIsRUFBRSxFQUFFLEVBQUVuQixFQUFFLEdBQUUsQ0FBQyxHQUFFbUIsRUFBRSxFQUFFLEVBQUVuQixFQUFFLEdBQUUsR0FBRUEsRUFBRSxDQUFDLEdBQUVtQixFQUFFLEVBQUUsRUFBRW5CLEVBQUUsR0FBRSxDQUFDLEdBQUVrRSxFQUFFbEUsRUFBRSxHQUFFLElBQUcsQ0FBQyxHQUFFbUIsRUFBRSxFQUFFLEVBQUVuQixFQUFFLEdBQUUsQ0FBQyxHQUFFbUIsRUFBRSxFQUFFLEVBQUVuQixFQUFFLEdBQUUsR0FBRUEsRUFBRSxDQUFDLEdBQUVtQixFQUFFLEVBQUUsRUFBRW5CLEVBQUUsR0FBRSxDQUFDLEdBQUVrRSxFQUFFbEUsRUFBRSxHQUFFLElBQUcsQ0FBQyxHQUFFa0UsRUFBRWxFLEVBQUUsR0FBRSxLQUFJLENBQUMsR0FBRWtFLEVBQUVsRSxFQUFFLEdBQUUsSUFBRyxDQUFDLEdBQUVrRSxFQUFFbEUsRUFBRSxHQUFFLEtBQUksQ0FBQztBQUFBLElBQUMsR0FBQyxHQUFHbUIsRUFBRSxFQUFFO0FBQUEsRUFBQyxHQUFDO0FBQUcsV0FBUzBDLEVBQVExQyxHQUFFO0FBQUMsV0FBTSxDQUFDLEdBQUUsTUFBSyxHQUFFLEdBQUUsR0FBRSxNQUFLLENBQUMsRUFBRUEsRUFBRSxLQUFLLElBQUVBLEVBQUU7QUFBQSxFQUFLO0FBQUMsV0FBUzhDLEVBQVk5QyxHQUFFbkIsR0FBRW9CLEdBQUVDLEdBQUVFLEdBQUU7QUFBQyxRQUFJRSxJQUFFb0MsRUFBUTdELENBQUM7QUFBRSxVQUFNMEIsSUFBRSxLQUFLLEtBQUtMLElBQUVJLElBQUUsQ0FBQztBQUFFLFFBQUlFLEdBQUVDO0FBQUUsSUFBQUgsSUFBRSxLQUFLLEtBQUtBLElBQUUsQ0FBQztBQUFFLFFBQUlJLElBQUVWLEVBQUVDLENBQUMsR0FBRVcsSUFBRTtBQUFFLFFB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YixFQUFFLE9BQU1hLEtBQUlRLEVBQUVSLENBQUMsSUFBRWIsRUFBRSxPQUFNYSxLQUFJUSxFQUFFUixDQUFDLElBQUUsR0FBRUEsS0FBSVEsRUFBRVIsQ0FBQyxJQUFFLEdBQUVBLEtBQUlRLEVBQUVSLENBQUMsSUFBRSxHQUFFQSxLQUFJSixFQUFFWSxHQUFFUixHQUFFTCxFQUFFYSxHQUFFUixJQUFFLElBQUcsRUFBRSxDQUFDLEdBQUVBLEtBQUcsR0FBUU4sRUFBRSxRQUFSLFNBQWVFLEVBQUVZLEdBQUVSLEdBQUUsQ0FBQyxHQUFFQSxLQUFHLEdBQUVELEVBQUVTLEdBQUVSLEdBQUUsTUFBTSxHQUFFQSxLQUFHLEdBQUVRLEVBQUVSLENBQUMsSUFBRU4sRUFBRSxNQUFLTSxLQUFJSixFQUFFWSxHQUFFUixHQUFFTCxFQUFFYSxHQUFFUixJQUFFLEdBQUUsQ0FBQyxDQUFDLEdBQUVBLEtBQUcsSUFBU04sRUFBRSxRQUFSLE1BQWE7QUFBQyxZQUFNUCxJQUFFLEtBQUdlLEVBQUU7QUFBTyxNQUFBTixFQUFFWSxHQUFFUixHQUFFYixDQUFDLEdBQUVhLEtBQUcsR0FBRUQsRUFBRVMsR0FBRVIsR0FBRSxNQUFNLEdBQUVBLEtBQUcsR0FBRUQsRUFBRVMsR0FBRVIsR0FBRSxhQUFhLEdBQUVBLEtBQUcsSUFBR0EsS0FBRyxHQUFFUSxFQUFFLElBQUlOLEdBQUVGLENBQUMsR0FBRUEsS0FBR0UsRUFBRSxRQUFPTixFQUFFWSxHQUFFUixHQUFFTCxFQUFFYSxHQUFFUixLQUFHYixJQUFFLElBQUdBLElBQUUsQ0FBQyxDQUFDLEdBQUVhLEtBQUc7QUFBQSxJQUFDO0FBQUMsUUFBU04sRUFBRSxRQUFSLFNBQWVFLEVBQUVZLEdBQUVSLEdBQUUsQ0FBQyxHQUFFQSxLQUFHLEdBQUVELEVBQUVTLEdBQUVSLEdBQUUsTUFBTSxHQUFFQSxLQUFHLEdBQUVKLEVBQUVZLEdBQUVSLEdBQUVOLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRU0sS0FBRyxHQUFFSixFQUFFWSxHQUFFUixHQUFFTixFQUFFLEtBQUssQ0FB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RSxFQUFFLElBQUVBLEVBQUUsQ0FBQyxHQUFFQSxFQUFFLEVBQUUsSUFBRUEsRUFBRSxDQUFDLEdBQUVBLEVBQUUsRUFBRSxJQUFFQSxFQUFFLEVBQUUsR0FBRSxFQUFDLEdBQUVBLEdBQUUsR0FBRUUsR0FBRSxHQUFFRSxFQUFDO0FBQUEsRUFBQztBQUFDLFdBQVM0RCxFQUFPbEUsR0FBRTtBQUFDLFVBQUssRUFBQyxHQUFFbkIsRUFBQyxJQUFFbUIsR0FBRSxFQUFDLEdBQUVDLEVBQUMsSUFBRUQsR0FBRSxFQUFDLEdBQUVFLEVBQUMsSUFBRUYsR0FBRU0sSUFBRUwsRUFBRSxDQUFDLEdBQUVNLElBQUVOLEVBQUUsQ0FBQyxHQUFFTyxJQUFFUCxFQUFFLENBQUMsR0FBRVEsSUFBRVIsRUFBRSxDQUFDLEdBQUVTLElBQUtSLEtBQUgsSUFBSyxJQUFFLElBQUVBLEdBQUVVLElBQUUsQ0FBQy9CLEVBQUUsQ0FBQyxJQUFFeUIsSUFBRUEsSUFBRUksR0FBRTdCLEVBQUUsQ0FBQyxJQUFFeUIsSUFBRUMsSUFBRUcsR0FBRTdCLEVBQUUsQ0FBQyxJQUFFeUIsSUFBRUUsSUFBRUUsR0FBRTdCLEVBQUUsQ0FBQyxJQUFFeUIsSUFBRUcsSUFBRUMsR0FBRTdCLEVBQUUsQ0FBQyxJQUFFMEIsSUFBRUQsSUFBRUksR0FBRTdCLEVBQUUsQ0FBQyxJQUFFMEIsSUFBRUEsSUFBRUcsR0FBRTdCLEVBQUUsQ0FBQyxJQUFFMEIsSUFBRUMsSUFBRUUsR0FBRTdCLEVBQUUsQ0FBQyxJQUFFMEIsSUFBRUUsSUFBRUMsR0FBRTdCLEVBQUUsQ0FBQyxJQUFFMkIsSUFBRUYsSUFBRUksR0FBRTdCLEVBQUUsQ0FBQyxJQUFFMkIsSUFBRUQsSUFBRUcsR0FBRTdCLEVBQUUsRUFBRSxJQUFFMkIsSUFBRUEsSUFBRUUsR0FBRTdCLEVBQUUsRUFBRSxJQUFFMkIsSUFBRUMsSUFBRUMsR0FBRTdCLEVBQUUsRUFBRSxJQUFFNEIsSUFBRUgsSUFBRUksR0FBRTdCLEVBQUUsRUFBRSxJQUFFNEIsSUFBRUYsSUFBRUcsR0FBRTdCLEVBQUUsRUFBRSxJQUFFNEIsSUFBRUQsSUFBRUUsR0FBRTdCLEVBQUUsRUFBRSxJQUFFNEIsSUFBRUEsSUFBRUMsQ0FBQyxHQUFFRyxJQUFFRCxHQUFFRSxJQUFFVjtBQUFFLFFBQUlXLElBQUUsQ0FBQyxLQUFLLE9BQU0sR0FBRyxLQUFLLE9BQU0sR0FBRyxLQUFLLE9BQU0sR0FBRyxLQUFLLE9BQU0sQ0FBRSxHQUFFQyxJQUFFLEdBQUVDLElBQUU7QUFBRSxRQUFNZixLQUFILEVBQUssVUFBUUYsSUFBRSxHQUFFQSxJQUFFLE9BQUtlLElBQUVELEVBQUUsUUFBUUQsR0FBRUUsQ0FBQyxHQUFFRSxJQUFFLEtBQUssS0FBS0gsRUFBRSxJQUFJQyxHQUFFQSxDQUFDLENBQUMsR0FBRUEsSUFBRUQsRUFBRSxJQUFJLElBQUVHLEdBQUVGLENBQUMsR0FBRSxFQUFLZixLQUFILEtBQU0sS0FBSyxJQUFJaUIsSUFBRUQsQ0FBQyxJQUFFLFFBQU9oQixJQUFJLENBQUFnQixJQUFFQztBQUFFLFVBQU1DLElBQUUsQ0FBQ1osSUFBRUksR0FBRUgsSUFBRUcsR0FBRUYsSUFBRUUsR0FBRUQsSUFBRUMsQ0FBQztBQUFFLFdBQU0sRUFBQyxLQUFJRSxHQUFFLEdBQUVNLEdBQUUsR0FBRUgsR0FBRSxHQUFFQyxHQUFFLFFBQU9GLEVBQUUsSUFBSUEsRUFBRSxJQUFJLEtBQUlJLENBQUMsR0FBRUgsQ0FBQyxHQUFFLEtBQUlELEVBQUUsSUFBSUMsR0FBRUcsQ0FBQyxHQUFFLE9BQU0sS0FBSyxNQUFNLE1BQUlBLEVBQUUsQ0FBQyxDQUFDLEtBQUcsS0FBRyxLQUFLLE1BQU0sTUFBSUEsRUFBRSxDQUFDLENBQUMsS0FBRyxLQUFHLEtBQUssTUFBTSxNQUFJQSxFQUFFLENBQUMsQ0FBQyxLQUFHLElBQUUsS0FBSyxNQUFNLE1BQUlBLEVBQUUsQ0FBQyxDQUFDLEtBQUcsT0FBSyxFQUFDO0FBQUEsRUFBQztBQUFDLE1BQUlkLElBQUUsRUFBQyxTQUFRLENBQUNKLEdBQUVuQixNQUFJLENBQUNtQixFQUFFLENBQUMsSUFBRW5CLEVBQUUsQ0FBQyxJQUFFbUIsRUFBRSxDQUFDLElBQUVuQixFQUFFLENBQUMsSUFBRW1CLEVBQUUsQ0FBQyxJQUFFbkIsRUFBRSxDQUFDLElBQUVtQixFQUFFLENBQUMsSUFBRW5CLEVBQUUsQ0FBQyxHQUFFbUIsRUFBRSxDQUFDLElBQUVuQixFQUFFLENBQUMsSUFBRW1CLEVBQUUsQ0FBQyxJQUFFbkIsRUFBRSxDQUFDLElBQUVtQixFQUFFLENBQUMsSUFBRW5CLEVBQUUsQ0FBQyxJQUFFbUIsRUFBRSxDQUFDLElBQUVuQixFQUFFLENBQUMsR0FBRW1CLEVBQUUsQ0FBQyxJQUFFbkIsRUFBRSxDQUFDLElBQUVtQixFQUFFLENBQUMsSUFBRW5CLEVBQUUsQ0FBQyxJQUFFbUIsRUFBRSxFQUFFLElBQUVuQixFQUFFLENBQUMsSUFBRW1CLEVBQUUsRUFBRSxJQUFFbkIsRUFBRSxDQUFDLEdBQUVtQixFQUFFLEVBQUUsSUFBRW5CLEVBQUUsQ0FBQyxJQUFFbUIsRUFBRSxFQUFFLElBQUVuQixFQUFFLENBQUMsSUFBRW1CLEVBQUUsRUFBRSxJQUFFbkIsRUFBRSxDQUFDLElBQUVtQixFQUFFLEVBQUUsSUFBRW5CLEVBQUUsQ0FBQyxDQUFDLEdBQUUsS0FBSSxDQUFDbUIsR0FBRW5CLE1BQUltQixFQUFFLENBQUMsSUFBRW5CLEVBQUUsQ0FBQyxJQUFFbUIsRUFBRSxDQUFDLElBQUVuQixFQUFFLENBQUMsSUFBRW1CLEVBQUUsQ0FBQyxJQUFFbkIsRUFBRSxDQUFDLElBQUVtQixFQUFFLENBQUMsSUFBRW5CLEVBQUUsQ0FBQyxHQUFFLEtBQUksQ0FBQ21CLEdBQUVuQixNQUFJLENBQUNtQixJQUFFbkIsRUFBRSxDQUFDLEdBQUVtQixJQUFFbkIsRUFBRSxDQUFDLEdBQUVtQixJQUFFbkIsRUFBRSxDQUFDLEdBQUVtQixJQUFFbkIsRUFBRSxDQUFDLENBQUMsRUFBQztBQUFFLEVBQUEyRCxHQUFLLFNBQU8sU0FBZ0J4QyxHQUFFbkIsR0FBRW9CLEdBQUVDLEdBQUVFLEdBQUVFLEdBQUVDLEdBQUU7QUFBQyxJQUFN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
