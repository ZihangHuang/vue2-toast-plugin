/**
 * @Author: ZihangHuang
 */

(function(root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.VueToast = factory();
  }
})(this, function() {
  "use strict";
  var Toast = {};
  var toastTimer;
  var toastVM;

  var loadingVM;
  var isLoading = false;

  Toast.install = function(Vue, options) {
    var opt = {
      position: "center",
      duration: 2000,
      wordWrap: false,
      width: "auto"
    };

    options &&
      Object.keys(options).forEach(v => {
        opt[v] = options[v];
      });

    Vue.prototype.$toast = function(tip, config, callback) {
      if (typeof tip !== "string") {
        throw new Error("Expected first argument to be a string.");
      }
      if (typeof config === "function" && typeof callback === "undefined") {
        callback = config;
        config = undefined;
      }

      if (typeof callback !== "undefined") {
        if (typeof callback !== "function") {
          console.error("Expected third argument to be a function!");
        }
      }

      var options = JSON.parse(JSON.stringify(opt));
      if (config) {
        if (Object.prototype.toString.call(config) === "[object Object]") {
          Object.keys(config).forEach(v => {
            options[v] = config[v];
          });
        } else {
          console.error("Expected second argument to be a object!");
        }
      }

      if (toastTimer) {
        clearTimeout(toastTimer);
        toastVM.show = false;
      }

      if (!toastVM) {
        const toastCon = Vue.extend({
          data: function() {
            return {
              show: false,
              tip: tip,
              wordWrap: options.wordWrap,
              position: options.position,
              icon: options.icon,
              styles: {
                width: options.width
              }
            };
          },
          render: function(h) {
            if (!this.show) return;

            return this.icon
              ? h(
                  "div",
                  {
                    class: [
                      "lx-toast",
                      "lx-toast-" + this.position,
                      this.wordWrap ? "lx-word-wrap" : ""
                    ],
                    style: this.styles,
                    show: this.show
                  },
                  [
                    h("i", {
                      class: ["icons " + this.icon]
                    }),
                    h("p", {
                      class: ["tip"],
                      domProps: {
                        innerText: this.tip
                      }
                    })
                  ]
                )
              : h("div", {
                  class: [
                    "lx-toast",
                    "lx-toast-" + this.position,
                    this.wordWrap ? "lx-word-wrap" : ""
                  ],
                  style: this.styles,
                  show: this.show,
                  domProps: {
                    innerText: this.tip
                  }
                });
          }
        });

        toastVM = new toastCon();
        var toastTpl = toastVM.$mount().$el;
        document.body.appendChild(toastTpl);
      }

      toastVM.tip = tip;
      toastVM.wordWrap = options.wordWrap;
      toastVM.position = options.position;
      toastVM.styles.width = options.width;
      toastVM.icon =
        config.icon && ["success", "error"].indexOf(config.icon) !== -1
          ? config.icon
          : "";
      toastVM.show = true;

      toastTimer = setTimeout(() => {
        toastVM.show = toastTimer = false;
        callback && callback();
      }, options.duration);
    };

    Vue.prototype.$loading = function(tip) {
      if (tip && typeof tip !== "string") {
        throw new Error("Expected argument to be a string.");
      }

      if (loadingVM) {
        loadingVM.tip = tip;
        if (!isLoading) {
          loadingVM.show = isLoading = true;
        }
        return;
      }
      var loadingCon = Vue.extend({
        data: function() {
          return {
            show: false,
            tip: tip
          };
        },
        render: function(h) {
          if (!this.show) return;

          return h(
            "div",
            {
              attrs: {
                class: "lx-load-mark"
              },
              show: this.show
            },
            [
              h(
                "div",
                {
                  attrs: {
                    class: "lx-load-box"
                  }
                },
                [
                  h(
                    "div",
                    {
                      attrs: {
                        class: [
                          this.tip ? "lx-loading" : "lx-loading-nocontent"
                        ]
                      }
                    },
                    Array.apply(null, { length: 12 }).map(function(
                      value,
                      index
                    ) {
                      return h("div", {
                        attrs: { class: "loading_leaf loading_leaf_" + index }
                      });
                    })
                  ),
                  h("div", {
                    attrs: {
                      class: "lx-load-content"
                    },
                    domProps: {
                      innerText: this.tip
                    }
                  })
                ]
              )
            ]
          );
        }
      });

      loadingVM = new loadingCon();
      var loadingTpl = loadingVM.$mount().$el;

      document.body.appendChild(loadingTpl);
      loadingVM.show = isLoading = true;
    };

    Vue.prototype.$loading.close = function() {
      if (loadingVM) {
        loadingVM.show = isLoading = false;
      }
    };
  };

  return Toast;
});
