(function ($) {
	"use strict";
	/*-------------------------------------
	Page Preloader
	-------------------------------------*/
	$("#preloader").fadeOut("slow", function () {
		$(this).remove();
	});

	/*-------------------------------------
	  Sidebar Toggle Menu
	-------------------------------------*/
	$(".menu-content").on("click", ".header-nav-item .menu-link", function (e) {
		if ($(this).parents("body").hasClass("mobile-menu-wrapper")) {
			var animationSpeed = 0,
				subMenuSelector = ".sub-menu",
				$this = $(this),
				checkElement = $this.next();
			if (checkElement.is(subMenuSelector) && checkElement.is(":visible")) {
				checkElement.slideUp(animationSpeed, function () {
					checkElement.removeClass("menu-open");
				});
				checkElement.parent(".header-nav-item").removeClass("active");
			} else if (
				checkElement.is(subMenuSelector) &&
				!checkElement.is(":visible")
			) {
				var parent = $this.parents("ul").first();
				var ul = parent.find("ul:visible").slideUp(animationSpeed);
				ul.removeClass("menu-open");
				var parent_li = $this.parent("li");
				checkElement.slideDown(animationSpeed, function () {
					checkElement.addClass("menu-open");
					parent.find(".header-nav-item.active").removeClass("active");
					parent_li.addClass("active");
				});
			}
			if (checkElement.is(subMenuSelector)) {
				e.preventDefault();
			}
		} else {
			if ($(this).attr("href") === "#") {
				e.preventDefault();
			}
		}
	});

	/*-------------------------------------
	Side menu class Add
	--------------------------------------*/
	$("#wrapper").on("click", ".toggler-open", function (event) {
		event.preventDefault();

		var $this = $(this),
			wrapp = $(this).parents("body").find("#wrapper"),
			wrapMask = $("<div / >").addClass("closeMask"),
			sideMenuSelect = ".fixed-sidebar";

		if (!$this.parents(sideMenuSelect).hasClass("lg-menu-open")) {
			wrapp.addClass("open").append(wrapMask);
			$this.parents(sideMenuSelect).addClass("lg-menu-open");
		} else {
			removeSideMenu();
		}

		function removeSideMenu() {
			wrapp.removeClass("open").find(".closeMask").remove();
			$this.parents(sideMenuSelect).removeClass("lg-menu-open");
		}

		$(".toggler-close, .closeMask").on("click", function () {
			removeSideMenu();
		});
	});

	/*-------------------------------------
	Mobile Menu Class Add
	--------------------------------------*/
	$(".mobile-menu-toggle").on("click", function () {
		if ($("#wrapper").hasClass("mobile-menu-expand")) {
			$("#wrapper").removeClass("mobile-menu-expand");
		} else {
			$("#wrapper").addClass("mobile-menu-expand");
		}
	});

	function mobile_nav_class() {
		var mq = window.matchMedia("(max-width: 991px)");
		if (mq.matches) {
			$("body").addClass("mobile-menu-wrapper");
		} else {
			$("body").removeClass("mobile-menu-wrapper");
		}
	}

	$(window).resize(function () {
		mobile_nav_class();
	});
	mobile_nav_class();

	/*-------------------------------------
	Chat Conversation Box
	-------------------------------------*/

	$("#chat-head-toggle").on("click", function () {
		$(this).parents(".fixed-sidebar").toggleClass("chat-head-hide");
	});

	$(".chat-plus-icon").on("click", function () {
		$(this).siblings(".file-attach-icon").toggleClass("show");
	});

	$(".chat-shrink").on("click", function () {
		$(this).parents("#chat-box-modal").toggleClass("shrink");
	});

	$(".chat-open").on("click", function () {
		$("#chat-box-modal").toggleClass("modal-show");

		setTimeout(function () {
			$("#chat-box-modal").removeClass("shrink");
		}, 300);
	});

	/*-------------------------------------
		Product View
	-------------------------------------*/
	$(".user-view-trigger").on("click", function (e) {
		var self = $(this),
			data = self.attr("data-type"),
			target = $("#user-view");
		self.parents(".user-view-switcher").find("li.active").removeClass("active");
		self.parent("li").addClass("active");
		target
			.children(".row")
			.find(">div")
			.animate(
				{
					opacity: 0,
				},
				200,
				function () {
					if (data === "user-grid-view") {
						target.removeClass("user-list-view");
						target.addClass("user-grid-view");
					} else if (data === "user-list-view") {
						target.removeClass("user-grid-view");
						target.addClass("user-list-view");
					}
					target.children(".row").find(">div").animate(
						{
							opacity: 1,
						},
						100,
					);
				},
			);
		e.preventDefault();
		return false;
	});

	/*-------------------------------------
		ElevateZoom
	-------------------------------------*/

	$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
		elevateZoom();
	});

	function elevateZoom() {
		if ($.fn.elevateZoom !== undefined) {
			$(".zoom_01").elevateZoom({
				zoomType: "inner",
				cursor: "crosshair",
				zoomWindowFadeIn: 500,
				zoomWindowFadeOut: 200,
			});
		}
	}

	elevateZoom();

	/*-------------------------------------
		Sal Init
	-------------------------------------*/
	sal({
		threshold: 0.05,
		once: true,
	});

	if ($(window).outerWidth() < 1025) {
		var scrollAnimations = sal();
		scrollAnimations.disable();
	}

})(jQuery);
const favicon = document.querySelector("link[rel='icon']");
const darkModeMediaQuery = window.matchMedia(
	"(prefers-color-scheme: dark)"
);

const faviconLightPath = "media/logos-miami/logo-morado.png";
const faviconDarkPath = "media/logos-miami/logo-blanco.png";

function setFaviconPath(path) {
	favicon.href = path;
}

if (darkModeMediaQuery.matches) {
	setFaviconPath(faviconDarkPath);
	console.log(faviconDarkPath);
} else {
	setFaviconPath(faviconLightPath);
	console.log(faviconLightPath);
}

darkModeMediaQuery.addEventListener("change", (event) => {
	if (event.matches) {
		setFaviconPath(faviconDarkPath);
	} else {
		setFaviconPath(faviconLightPath);
	}
});

function scrollToTop() {
	// Desplaza la página suavemente hacia arriba
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}