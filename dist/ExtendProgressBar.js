$.widget("ui.progressbar", $.ui.progressbar, {
    _refreshValue: function () {
        var value = this.options.value, percentage = this._percentage();
        this.valueDiv
            .toggle(this.indeterminate || value > this.min)
            .width(percentage + "%");
        this
            ._toggleClass(this.valueDiv, "ui-progressbar-complete", null, value === this.options.max)
            ._toggleClass("ui-progressbar-indeterminate", null, this.indeterminate);
        if (this.indeterminate) {
            this.element.removeAttr("aria-valuenow");
            if (!this.overlayDiv) {
                this.overlayDiv = $("<div>").appendTo(this.valueDiv);
                this._addClass(this.overlayDiv, "ui-progressbar-overlay");
            }
        }
        else {
            this.element.attr({
                "aria-valuemax": this.options.max,
                "aria-valuenow": value
            });
            if (this.overlayDiv) {
                this.overlayDiv.remove();
                this.overlayDiv = null;
            }
        }
        if (this.oldValue !== value) {
            this.oldValue = value;
            this._trigger("change");
        }
        if (value === this.options.max) {
            this._trigger("complete");
        }
    }
});
//# sourceMappingURL=ExtendProgressBar.js.map