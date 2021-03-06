﻿/* jQuery Group | Copyright (c) Teijo Laine 2013 | Licenced under the MIT licence */
(function() {
    ! function(a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A;
        return t = {
            win: 3,
            tie: 1,
            loss: 0
        }, p = function(a) {
            return a - 1 + a % 2
        }, z = function(a) {
            var b;
            return o.test(a) ? (b = parseInt(a), isNaN(b) ? null : b) : null
        }, d = function(b) {
            return a(b.currentTarget)
        }, c = function(a) {
            return [a, d(a)]
        }, y = function(a, b) {
            return a.findIndex(function(a) {
                return a.id === b.id
            })
        }, A = function(a) {
            return {
                teams: a.participants.value().map(function(a) {
                    return {
                        id: a.id,
                        name: a.name
                    }
                }),
                matches: a.matches.map(function(b) {
                    return {
                        a: {
                            team: y(a.participants, b.a.team),
                            score: b.a.score
                        },
                        b: {
                            team: y(a.participants, b.b.team),
                            score: b.b.score
                        },
                        round: b.round
                    }
                }).value()
            }
        }, j = function(a, b) {
            return a.map(function(a) {
                var c, d, e, f, g, h;
                return d = b.filter(function(a) {
                    return null !== a.a.score && null !== a.b.score
                }).filter(function(b) {
                    return b.a.team === a || b.b.team === a
                }).map(function(b) {
                    return b.a.team === a ? {
                        ownScore: b.a.score,
                        opponentScore: b.b.score
                    } : {
                        ownScore: b.b.score,
                        opponentScore: b.a.score
                    }
                }), f = d.reduce(function(a, b) {
                    return a + b.ownScore
                }, 0), e = d.reduce(function(a, b) {
                    return a + b.opponentScore
                }, 0), h = d.filter(function(a) {
                    return a.ownScore > a.opponentScore
                }).size(), c = d.filter(function(a) {
                    return a.ownScore < a.opponentScore
                }).size(), g = d.filter(function(a) {
                    return a.ownScore === a.opponentScore
                }).size(), {
                    team: a,
                    wins: h,
                    losses: c,
                    ties: g,
                    points: h * t.win + g * t.tie + c * t.loss,
                    roundWins: f,
                    roundLosses: e,
                    ratio: f - e
                }
            }).sortBy(function(a) {
                return -a.ratio
            }).sortBy(function(a) {
                return -a.points
            })
        }, o = new RegExp(/^[0-9]+$/), v = '    <td>{{wins}}</td>    <td>{{losses}}</td>    <td>{{ties}}</td>    <td>{{points}}</td>    <td title="Won {{roundWins}}, lost {{roundLosses}} bouts">{{ratio}}</td>', w = Handlebars.compile('    <div class="standings">      <table>        <colgroup>          <col style="width: 50%">          <col span="5" style="width: 10%">        </colgroup>        <tr><th></th><th>W</th><th>L</th><th>T</th><th>P</th><th>&plusmn;</th></tr>        {{#each this}}          <tr data-teamid="{{team.id}}"><td>{{#if team.label}}{{team.label}}{{else}}{{team.name}}{{/if}}</td>' + v + "</tr>        {{/each}}      </table>    </div>"), u = Handlebars.compile('    <div class="standings">      <table>        <colgroup>          <col style="width: 40%">          <col span="6" style="width: 10%">        </colgroup>        <tr><th></th><th>W</th><th>L</th><th>T</th><th>P</th><th>&plusmn;</th><th></th></tr>        {{#each this}}          <tr><td><input class="name" type="text" data-prev="{{team.name}}" data-teamid="{{team.id}}" value="{{team.name}}" /></td>' + v + '<td class="drop" data-name="{{team.id}}" title="Drop team">&#x2A2F;</td></tr>        {{/each}}        <tr><td><input class="add" type="text" /></td><td colspan="6"><input type="submit" value="Add" disabled="disabled" /></td></tr>      </table>    </div>'), q = Handlebars.compile('    <div data-roundid="{{this}}" class="round">      {{#if this}}        <header>Round {{this}}</header>      {{else}}        <header>Unassigned</header>      {{/if}}    </div>'), m = Handlebars.compile('    <div data-matchid="{{id}}" class="match" draggable="{{draggable}}">      <div class="team" data-teamid="{{a.team.id}}">        <div class="label">{{a.team.label}}</div>        <div class="score {{homeClass}}">{{a.score}}</div>      </div>      <div class="team" data-teamid="{{b.team.id}}">        <div class="score {{awayClass}}">{{b.score}}</div>        <div class="label">{{b.team.label}}</div>      </div>    </div>'), k = Handlebars.compile('    <div data-matchid="{{id}}" class="match" draggable="{{draggable}}">      <div class="team" data-teamid="{{b.team.id}}">        <div class="label">{{a.team.name}}</div>        <input type="text" class="score home {{homeClass}}" value="{{a.score}}" />      </div>      <div class="team" data-teamid="{{b.team.id}}">        <input type="text" class="score away {{awayClass}}" value="{{b.score}}" />        <div class="label">{{b.team.name}}</div>      </div>    </div>'), l = function(b, c) {
            var d, e;
            return e = b.a.score > b.b.score, d = {
                homeClass: e ? "win" : "lose",
                awayClass: e ? "lose" : "win"
            }, a(c(_.extend(d, b)))
        }, r = Handlebars.compile('    <header class="roundsHeader">Rounds</header>'), s = Handlebars.compile('<div class="rounds"></div>'), b = function(a) {
            return a.name
        }, h = 0, e = function() {
            return ++h
        }, i = 0, f = function() {
            return ++i
        }, x = function(b, c) {
            return function() {
                var d;
                return d = a(this).attr("data-teamid"), b.find("[data-teamid=" + d + "]").toggleClass("highlight", c)
            }
        }, g = function(b, g, h, i) {
            var n, o, t, v, y, B, C, D, E, F, G, H, I, J, K, L, M, N, O;
            return N = function(a) {
                return b.find("[data-roundid='" + a + "']")
            }, v = function(a) {
                return b.find("[data-matchid='" + a + "']")
            }, i && b.addClass("read-write"), O = function() {
                return {
                    standings: function(c, e, g, h) {
                        var j, k, l, m, n, o;
                        return h = h || _([]), i ? (n = a(u(h.value())), k = n.find("input[type=submit]"), m = n.find("input").asEventStream("keyup").map(d).map(function(a) {
                            var b, c, d;
                            return d = a.val(), b = a.attr("data-prev"), c = d.length > 0 && (!h.map(function(a) {
                                return a.team
                            }).pluck("name").contains(d) || b === d), {
                                el: a,
                                value: d,
                                valid: c
                            }
                        }).toProperty(), m.onValue(function(a) {
                            return a.el.toggleClass("conflict", !a.valid), a.el.hasClass("add") ? a.valid ? k.removeAttr("disabled") : k.attr("disabled", "disabled") : void 0
                        }), l = m.map(function(a) {
                            return a.valid
                        }).toProperty(), n.find("input.name").asEventStream("change").filter(l).map(".target").map(a).onValue(function(a) {
                            return e.push({
                                id: parseInt(a.attr("data-teamid")),
                                to: a.val()
                            }), a.attr("data-prev", a.val())
                        }), n.find("input.add").asEventStream("change").filter(l).map(".target").map(a).map(function(a) {
                            return a.val()
                        }).onValue(function(a) {
                            return c.push({
                                id: f(),
                                name: a
                            })
                        }), n.find("td.drop").asEventStream("click").map(".target").map(a).map(function(a) {
                            return a.attr("data-name")
                        }).onValue(function(a) {
                            return g.push(parseInt(a))
                        }), n) : (j = a(w(h.value())), o = x.bind(null, b), j.find("[data-teamid]").hover(o(!0), o(!1)), j)
                    },
                    roundsHeader: function(b) {
                        var c;
                        return c = a(r()), c.asEventStream("click").onValue(function() {
                            return b.toggle()
                        }), c
                    },
                    rounds: a(s()),
                    round: function(b) {
                        return a(q(b))
                    },
                    matchEdit: function(a) {
                        return l(a, k)
                    },
                    matchView: function(a) {
                        return l(a, m)
                    }
                }
            }(), t = function() {
                return {
                    create: function(a, b) {
                        return new function() {
                            var e, f;
                            f = O.round(b), this.markup = f, i && (e = 0, f.asEventStream("dragover").doAction(".preventDefault").onValue(function() {}), f.asEventStream("dragenter").doAction(".preventDefault").map(d).onValue(function(a) {
                                0 === e && a.addClass("over"), e++
                            }), f.asEventStream("dragleave").doAction(".preventDefault").map(d).onValue(function(a) {
                                e--, 0 === e && a.removeClass("over")
                            }), f.asEventStream("drop").doAction(".preventDefault").map(c).onValues(function(b, c) {
                                var d, f;
                                e = 0, d = b.originalEvent.dataTransfer.getData("Text"), f = v(d), c.append(f), c.removeClass("over"), a.push({
                                    match: parseInt(d),
                                    round: parseInt(c.attr("data-roundId"))
                                })
                            }))
                        }
                    }
                }
            }(), o = function() {
                return {
                    create: function(e, f) {
                        return new function() {
                            var g;
                            return f = a.extend({}, f), f.draggable = (null != i).toString(), i ? (g = O.matchEdit(f), this.markup = g, g.find("input").asEventStream("keyup").map(d).onValue(function(a) {
                                return a.toggleClass("conflict", null === z(a.val()))
                            }), g.find("input").asEventStream("change").onValue(function() {
                                var a, b, c;
                                return a = z(g.find("input.home").val()), b = z(g.find("input.away").val()), null !== a && null !== b ? (c = {
                                    a: {
                                        team: f.a.team,
                                        score: a
                                    },
                                    b: {
                                        team: f.b.team,
                                        score: b
                                    }
                                }, e.push(c)) : void 0
                            }), g.asEventStream("dragstart").map(".originalEvent").map(c).onValues(function(a, c) {
                                return a.dataTransfer.setData("Text", f.id), c.css("opacity", .5, ""), b.find(".round").addClass("droppable")
                            }), g.asEventStream("dragend").map(".originalEvent").map(c).onValues(function(a, c) {
                                return c.removeAttr("style"), b.find(".droppable").removeClass("droppable")
                            }), void 0) : (this.markup = O.matchView(f), void 0)
                        }
                    }
                }
            }(), B = new Bacon.Bus, H = new Bacon.Bus, J = new Bacon.Bus, L = new Bacon.Bus, C = new Bacon.Bus, I = new Bacon.Bus, y = B.toProperty({
                participants: _([]),
                matches: _([])
            }), n = O.rounds.append(a(t.create(C, 0).markup)), b.append(O.standings(H)).append(O.roundsHeader(n)).append(n), D = y.sampledBy(H, function(a, b) {
                var c, d;
                return a.participants.size() > 0 && (c = a.participants.map(function(a) {
                    return {
                        id: e(),
                        a: {
                            team: a,
                            score: null
                        },
                        b: {
                            team: b,
                            score: null
                        }
                    }
                }), a.matches = a.matches.union(c.value())), a.participants.push(b), d = p(a.participants.size()), _(_.range(n.find(".round").length - 1, d)).each(function(a) {
                    return n.append(t.create(C, a + 1).markup)
                }), a
            }), F = y.sampledBy(I, function(a, b) {
                var c, d, e;
                return a.matches.filter(function(a) {
                    return a.a.team.id === b || a.b.team.id === b
                }).map(function(a) {
                    return a.id
                }).forEach(function(a) {
                    return v(a).remove()
                }), e = p(a.participants.size()), a.participants = a.participants.filter(function(a) {
                    return a.id !== b
                }), d = p(a.participants.size()), a.matches = a.matches.filter(function(a) {
                    return a.a.team.id !== b && a.b.team.id !== b
                }).map(function(a) {
                    return a.round > d && (a.round = 0), a
                }), c = N(0), _(_.range(d + 1, e + 1)).each(function(a) {
                    var b, d;
                    return d = N(a), b = d.find(".match"), c.append(b), d.remove()
                }), a
            }), M = y.sampledBy(L, function(a, b) {
                return a.matches = a.matches.map(function(a) {
                    return a.a.team.id === b.a.team.id && a.b.team.id === b.b.team.id ? (void 0 !== b.round && (a.round = b.round), a.a.score = b.a.score, a.b.score = b.b.score) : a.a.team.id === b.b.team.id && a.b.team.id === b.a.team.id && (void 0 !== b.round && (a.round = b.round), a.a.score = b.b.score, a.b.score = b.a.score), a
                }), a
            }), G = y.sampledBy(J, function(a, b) {
                return a.participants = a.participants.map(function(a) {
                    return a.id === b.id && (a.name = b.to), a
                }), a
            }), E = y.sampledBy(C, function(a, b) {
                return a.matches = a.matches.map(function(a) {
                    return a.id === b.match && (a.round = b.round), a
                }), a
            }), K = Bacon.mergeAll([D, M, G, F, E]), K.throttle(10).onValue(function(a) {
                return i ? i(A(a)) : void 0
            }), D.merge(M).merge(F).throttle(10).onValue(function(a) {
                return b.find(".standings").replaceWith(O.standings(H, J, I, j(a.participants, a.matches), null))
            }), G.merge(D).merge(M).throttle(10).onValue(function(a) {
                var b, c, d;
                return c = a.matches.filter(function(a) {
                    return a.round
                }), d = a.matches.filter(function(a) {
                    return !a.round
                }), c.each(function(a) {
                    var b, c;
                    return b = v(a.id), c = o.create(L, a).markup, b.length ? b.replaceWith(c) : N(a.round).append(c)
                }), d.size() > 0 || i ? (b = N(0), b.show(), d.each(function(a) {
                    var c, d;
                    return c = v(a.id), d = o.create(L, a).markup, c.length ? c.replaceWith(d) : b.append(d)
                })) : void 0
            }), g.each(function(a) {
                return H.push(a)
            }), h.each(function(a) {
                return L.push(a)
            })
        }, n = {
            init: function(c) {
                var d, e, f, h;
                return c = c || {}, e = c.labeler || b, d = this, h = _(), f = _(), c.init && (h = _(c.init.teams).map(function(a) {
                    return a.label = new Handlebars.SafeString(e(a)), a
                }), f = _(c.init.matches).map(function(a) {
                    return a.a.team = c.init.teams[a.a.team], a.b.team = c.init.teams[a.b.team], a
                })), g(a('<div class="jqgroup"></div>').appendTo(d), h, f, c.save || null)
            }
        }, a.fn.group = function(b) {
            return n[b] ? n[b].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof b && b ? a.error("Method " + b + " does not exist on jQuery.group") : n.init.apply(this, arguments)
        }
    }(jQuery)
}).call(this);