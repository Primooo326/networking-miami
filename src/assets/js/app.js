!(function (e) {
    "use strict"
    var a = e("#contact-form")
    function t() {
        window.matchMedia("(max-width: 991px)").matches
            ? e("body").addClass("mobile-menu-wrapper")
            : e("body").removeClass("mobile-menu-wrapper")
    }
    a.length &&
        a.validator().on("submit", function (t) {
            var o = e(this),
                s = a.find(".form-response")
            if (!t.isDefaultPrevented())
                return (
                    e.ajax({
                        url: "php/form-process.php",
                        type: "POST",
                        data: a.serialize(),
                        beforeSend: function () {
                            s.html(
                                "<div class='alert alert-info mb-0'><p>Loading ...</p></div>",
                            )
                        },
                        success: function (e) {
                            var a = JSON.parse(e)
                            if ((console.log(a), a.success))
                                o[0].reset(),
                                    s.html(
                                        "<div class='alert alert-success mb-0'><p>Message has been sent successfully.</p></div>",
                                    )
                            else if (a.message.length) {
                                var t = null
                                a.message.forEach(function (e) {
                                    t += "<p>" + e + "</p>"
                                }),
                                    s.html(
                                        "<div class='alert alert-success mb-0'><p>" +
                                        t +
                                        "</p></div>",
                                    )
                            }
                        },
                        error: function () {
                            s.html(
                                "<div class='alert alert-success mb-0'><p>Error !!!</p></div>",
                            )
                        },
                    }),
                    !1
                )
            s.html(
                "<div class='alert alert-danger mb-0'><p>Please select all required field.</p></div>",
            )
        }),
        e(window).on("scroll", function () {
            if (
                (e(window).scrollTop() > 500
                    ? e(".scrollup").addClass("back-top")
                    : e(".scrollup").removeClass("back-top"),
                    e("body").hasClass("sticky-header"))
            ) {
                var a = e("#rt-sticky-placeholder"),
                    t = e("#header-menu"),
                    o = t.outerHeight(),
                    s =
                        (e("#header-topbar").outerHeight() || 0) +
                        (e("#header-middlebar").outerHeight() || 0)
                e(window).scrollTop() > s
                    ? (t.addClass("rt-sticky"), a.height(o))
                    : (t.removeClass("rt-sticky"), a.height(0))
            }
        }),
        e('[data-type="section-switch"]').on("click", function () {
            if (
                location.pathname.replace(/^\//, "") ===
                this.pathname.replace(/^\//, "") &&
                location.hostname === this.hostname
            ) {
                var a = e(this.hash)
                if (a.length > 0)
                    return (
                        (a = a.length ? a : e("[name=" + this.hash.slice(1) + "]")),
                        e("html,body").animate({ scrollTop: a.offset().top }, 1e3),
                        !1
                    )
            }
        }),
        e("#preloader").fadeOut("slow", function () {
            e(this).remove()
        }),
        e(".menu-content").on("click", ".header-nav-item .menu-link", function (a) {
            if (e(this).parents("body").hasClass("mobile-menu-wrapper")) {
                var t = ".sub-menu",
                    o = e(this),
                    s = o.next()
                if (s.is(t) && s.is(":visible"))
                    s.slideUp(0, function () {
                        s.removeClass("menu-open")
                    }),
                        s.parent(".header-nav-item").removeClass("active")
                else if (s.is(t) && !s.is(":visible")) {
                    var i = o.parents("ul").first()
                    i.find("ul:visible").slideUp(0).removeClass("menu-open")
                    var n = o.parent("li")
                    s.slideDown(0, function () {
                        s.addClass("menu-open"),
                            i.find(".header-nav-item.active").removeClass("active"),
                            n.addClass("active")
                    })
                }
                s.is(t) && a.preventDefault()
            } else "#" === e(this).attr("href") && a.preventDefault()
        }),
        e("#wrapper").on("click", ".toggler-open", function (a) {
            a.preventDefault()
            var t = e(this),
                o = e(this).parents("body").find("#wrapper"),
                s = e("<div / >").addClass("closeMask"),
                i = ".fixed-sidebar"
            function n() {
                o.removeClass("open").find(".closeMask").remove(),
                    t.parents(i).removeClass("lg-menu-open")
            }
            t.parents(i).hasClass("lg-menu-open")
                ? n()
                : (o.addClass("open").append(s), t.parents(i).addClass("lg-menu-open")),
                e(".toggler-close, .closeMask").on("click", function () {
                    n()
                })
        }),
        e(".mobile-menu-toggle").on("click", function () {
            e("#wrapper").hasClass("mobile-menu-expand")
                ? e("#wrapper").removeClass("mobile-menu-expand")
                : e("#wrapper").addClass("mobile-menu-expand")
        }),
        e(window).resize(function () {
            t()
        }),
        t(),
        e("#chat-head-toggle").on("click", function () {
            e(this).parents(".fixed-sidebar").toggleClass("chat-head-hide")
        }),
        e(".chat-plus-icon").on("click", function () {
            e(this).siblings(".file-attach-icon").toggleClass("show")
        }),
        e(".chat-shrink").on("click", function () {
            e(this).parents("#chat-box-modal").toggleClass("shrink")
        }),
        e(".chat-open").on("click", function () {
            e("#chat-box-modal").toggleClass("modal-show"),
                setTimeout(function () {
                    e("#chat-box-modal").removeClass("shrink")
                }, 300)
        }),
        e(".drop-btn").on("click", function () {
            var a = e(this),
                t = e(".drop-menu"),
                o = e("<div / >").addClass("closeMask")
            t.hasClass("show")
                ? (a.siblings(t).removeClass("show"),
                    e("#wrapper").find(".closeMask").remove())
                : (a.siblings(t).addClass("show"),
                    e("#wrapper").addClass("open").append(o)),
                e(".closeMask").on("click", function () {
                    a.siblings(t).removeClass("show"),
                        e("#wrapper").find(".closeMask").remove()
                })
        }),
        e("[data-bg-image]").each(function () {
            var a = e(this).data("bg-image")
            e(this).css({ backgroundImage: "url(" + a + ")" })
        })
    var o = e(".isotope-wrap")
    if (o.length > 0) {
        var s,
            i = e(".featuredContainer", o).imagesLoaded(function () {
                s = e(".featuredContainer", o).isotope({
                    filter: "*",
                    transitionDuration: "1s",
                    hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
                    visibleStyle: { transform: "scale(1)", opacity: 1 },
                })
            })
        o.find(".isotope-classes-tab").on("click", "a", function () {
            var a = e(this)
            a.parent(".isotope-classes-tab").find("a").removeClass("current"),
                a.addClass("current")
            var t = a.attr("data-filter")
            return s.isotope({ filter: t }), !1
        })
    }
    var n = e("#no-equal-gallery")
    if (n.length)
        i = n.imagesLoaded(function () {
            i.isotope({
                itemSelector: ".no-equal-item",
                masonry: { columnWidth: ".no-equal-item", horizontalOrder: !0 },
            })
        })
    function l() {
        void 0 !== e.fn.elevateZoom &&
            e(".zoom_01").elevateZoom({
                zoomType: "inner",
                cursor: "crosshair",
                zoomWindowFadeIn: 500,
                zoomWindowFadeOut: 200,
            })
    }
    e(".user-view-trigger").on("click", function (a) {
        var t = e(this),
            o = t.attr("data-type"),
            s = e("#user-view")
        return (
            t.parents(".user-view-switcher").find("li.active").removeClass("active"),
            t.parent("li").addClass("active"),
            s
                .children(".row")
                .find(">div")
                .animate({ opacity: 0 }, 200, function () {
                    "user-grid-view" === o
                        ? (s.removeClass("user-list-view"), s.addClass("user-grid-view"))
                        : "user-list-view" === o &&
                        (s.removeClass("user-grid-view"), s.addClass("user-list-view")),
                        s.children(".row").find(">div").animate({ opacity: 1 }, 100)
                }),
            a.preventDefault(),
            !1
        )
    }),
        e("#quantity-holder")
            .on("click", ".quantity-plus", function () {
                var a = e(this)
                    .parents(".quantity-holder")
                    .find("input.quantity-input"),
                    t = parseInt(a.val(), 10)
                e.isNumeric(t) && t > 0 ? ((t += 1), a.val(t)) : a.val(t)
            })
            .on("click", ".quantity-minus", function () {
                var a = e(this)
                    .parents(".quantity-holder")
                    .find("input.quantity-input"),
                    t = parseInt(a.val(), 10)
                e.isNumeric(t) && t >= 2 ? ((t -= 1), a.val(t)) : a.val(1)
            }),
        e('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
            l()
        }),
        l(),
        e('[data-toggle="tooltip"]').tooltip(),
        e(".slick-carousel").slick(),
        e("select.select2").length &&
        e("select.select2").select2({
            theme: "classic",
            dropdownAutoWidth: !0,
            width: "100%",
            minimumResultsForSearch: 1 / 0,
        })
    var r = e(".popup-youtube")
        ; (r.length &&
            r.magnificPopup({
                disableOn: 700,
                type: "iframe",
                mainClass: "mfp-fade",
                removalDelay: 160,
                preloader: !1,
                fixedContentPos: !1,
            }),
            e(".zoom-gallery").length &&
            e(".zoom-gallery").each(function () {
                e(this).magnificPopup({
                    delegate: "a.popup-zoom",
                    type: "image",
                    gallery: { enabled: !0 },
                })
            }),
            e("#googleMap").length &&
            (window.onload = function () {
                var e = {
                    mapTypeControlOptions: { mapTypeIds: ["Styled"] },
                    center: new google.maps.LatLng(-37.81618, 144.95692),
                    zoom: 10,
                    disableDefaultUI: !0,
                    mapTypeId: "Styled",
                },
                    a = document.getElementById("googleMap"),
                    t = new google.maps.Map(a, e),
                    o = new google.maps.StyledMapType(
                        [
                            {
                                featureType: "water",
                                elementType: "geometry.fill",
                                stylers: [{ color: "#b7d0ea" }],
                            },
                            {
                                featureType: "road",
                                elementType: "labels.text.fill",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "road",
                                elementType: "geometry.stroke",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [{ color: "#c2c2aa" }],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "geometry",
                                stylers: [{ color: "#b6d1b0" }],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#6b9a76" }],
                            },
                        ],
                        { name: "Styled" },
                    )
                t.mapTypes.set("Styled", o)
                new google.maps.Marker({
                    position: t.getCenter(),
                    animation: google.maps.Animation.BOUNCE,
                    icon: "media/map-marker.png",
                    map: t,
                })
            }),
            sal({ threshold: 0.05, once: !0 }),
            e(window).outerWidth() < 1025) && sal().disable()
    e('a[href="#header-search"]').on("click", function (a) {
        a.preventDefault()
        var t = e("#header-search")
        return (
            t.addClass("open"),
            setTimeout(function () {
                t.find("input").focus()
            }, 600),
            !1
        )
    }),
        e("#header-search, #header-search button.close").on(
            "click keyup",
            function (a) {
                ; (a.target !== this &&
                    "close" !== a.target.className &&
                    27 !== a.keyCode) ||
                    e(this).removeClass("open")
            },
        )
})(jQuery)
const favicon = document.querySelector("link[rel='icon']"),
    darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)"),
    faviconLightPath = "media/logos-miami/logo-morado.png",
    faviconDarkPath = "media/logos-miami/logo-blanco.png"
function setFaviconPath(e) {
    favicon.href = e
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
}
darkModeMediaQuery.matches
    ? (setFaviconPath(faviconDarkPath), console.log(faviconDarkPath))
    : (setFaviconPath(faviconLightPath), console.log(faviconLightPath)),
    darkModeMediaQuery.addEventListener("change", (e) => {
        e.matches
            ? setFaviconPath(faviconDarkPath)
            : setFaviconPath(faviconLightPath)
    })
