﻿window.DataAwareItem = (function () {
    var svgIcon = '<svg id="dataAwareItemIcon" viewBox="0 0 24 24"><path stroke="#ffffff" fill="#4842f4" d="M12 2 L2 22 L22 22 Z" /></svg>';
    var Dashboard = DevExpress.Dashboard;

    // Changes the availability of the dependent properties.
    function updateItemState(dxForm, itemName, newValue) {
        if (itemName == "backColorEnabledProperty")
            changeDisabledState(dxForm, "backColorProperty", !newValue);
        else if (itemName == "rowBorderVisibleProperty") {
            changeVisibleState(dxForm, "rowBorderWeightProperty", newValue);
        }
    }

    // Switches the UI component disabled state.
    function changeDisabledState(dxForm, fieldName, isDisabled) {
        let itemOptions = dxForm.itemOption(fieldName);
        if (itemOptions) {
            let editorOptions = itemOptions.editorOptions || {};
            editorOptions.disabled = isDisabled
            dxForm.itemOption(fieldName, "editorOptions", editorOptions)
        }
    }

    // Switches the UI component visibility.
    function changeVisibleState(dxForm, fieldName, isVisible) {
        dxForm.itemOption(fieldName, "visible", isVisible);
    }

    var dataAwareItemMetaData = {
        bindings: [{
            propertyName: "dimensionValue",
            dataItemType: "Dimension",
            displayName: "Dimension",
            enableColoring: true
        }],
        customProperties: [{
            ownerType: Dashboard.Model.CustomItem,
            propertyName: "backColorEnabledProperty",
            valueType: "boolean",
            defaultValue: false,
        }, {
            owner: Dashboard.Model.CustomItem,
            propertyName: "backColorProperty",
            valueType: "string",
            defaultValue: "Red"
        }, {
            ownerType: Dashboard.Model.CustomItem,
            propertyName: "rowBorderVisibleProperty",
            valueType: "boolean",
            defaultValue: false,
        }, {
            owner: Dashboard.Model.CustomItem,
            propertyName: "rowBorderWeightProperty",
            valueType: "number",
            defaultValue: 1
            }],
        /*Configures the Options panel to display custom properties.*/
        optionsPanelSections: [{
            onFieldDataChanged: function(e) {
                updateItemState(e.component, e.dataField, e.value);
            },
            onInitialized: function(e) {
                const dxForm = e.component;
                const items = dxForm.option("items");
                const formData = dxForm.option("formData");
                dxForm.beginUpdate();
                items.forEach(function (item) { updateItemState(dxForm, item.dataField, formData[item.dataField]()); });
                dxForm.endUpdate();
            },
            title: "Custom Properties",
            items: [{
                dataField: "backColorEnabledProperty",
                editorType: "dxCheckBox",
                label: { text: "Enable BackColor" },
                editorOptions: { text: "BackColor" }
            }, {
                dataField: "backColorProperty",
                label: { text: "BackColor" },
                template: Dashboard.Designer.FormItemTemplates.buttonGroup,
                editorOptions: {
                    items: [
                        { text: "Red" },
                        { text: "Blue" }
                    ]
                }
            }, { 
                dataField: "rowBorderVisibleProperty",
                editorType: "dxSelectBox",
                label: { text: "Show Row Border" },
                editorOptions: {
                    items: [
                        { value: false, displayValue: "Off" },
                        { value: true, displayValue: "On" }
                    ],
                    displayExpr: "displayValue",
                    valueExpr: "value"
                }
            }, { 
                dataField: "rowBorderWeightProperty",
                editorType: "dxSelectBox",
                label: { text: "Row Border Weight" },
                editorOptions: {
                    items: [
                        { value: 1, displayValue: "Light" },
                        { value: 5, displayValue: "Medium" },
                        { value: 10, displayValue: "Bold" },
                    ],
                    displayExpr: "displayValue",
                    valueExpr: "value"
                }
            }]
        }],
        icon: "dataAwareItemIcon",
        title: "Data Aware Item"
    };

    class DataAwareItemViewer extends Dashboard.CustomItemViewer {
        constructor(model, $container, options) {
            super(model, $container, options);
        }

        renderContent($element, changeExisting) {
            var element = $element.jquery ? $element[0] : $element;
            while (element.firstChild)
                element.removeChild(element.firstChild);
            var clientData = this._getDataSource();
            var that = this;
            clientData.forEach(function (item) {
                var div = document.createElement("div");
                div.style.color = item.color;
                div.style["text-align"] = "center";
                div.innerText = item.dimensionDisplayText;

                element.appendChild(div);

                if (that._getRowBorderVisibleProperty()){
                    var hr = document.createElement("hr");
                    hr.style.height = that._getRowBorderWeightProperty() + "px";
                    element.appendChild(hr);
                }
            });

            if (this._getBackColorEnabledProperty())
                element.style.background = this._getBackColorProperty();
            else
                element.style.background = "";

            element.style.overflow = "auto";
        }
        _getDataSource() {
            var clientData = [];
            this.iterateData(function (dataRow) {
                clientData.push({
                    dimensionDisplayText: dataRow.getDisplayText("dimensionValue")[0] || "",
                    color: dataRow.getColor()[0]
                });
            });
            return clientData;
        }
        _getBackColorProperty() {
            switch (this.getPropertyValue("backColorProperty")) {
                case "Red": return "rgb(255,220,200)";
                case "Blue": return "rgb(135,206,235)";
            }
        }

        _getBackColorEnabledProperty() {
            return this.getPropertyValue("backColorEnabledProperty");
        }

        _getRowBorderWeightProperty() {
            return this.getPropertyValue("rowBorderWeightProperty");
        }

        _getRowBorderVisibleProperty() {
            return this.getPropertyValue("rowBorderVisibleProperty");
        }
    }
    class DataAwareItem {
        constructor(dashboardControl) {
            DevExpress.Dashboard.ResourceManager.registerIcon(svgIcon);
            this.name = "dataAwareItem";
            this.metaData = dataAwareItemMetaData;
        }
        createViewerItem(model, $element, content) {
            return new DataAwareItemViewer(model, $element, content);
        }
    }

    return DataAwareItem;
})();