import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import History from "sap/ui/core/routing/History";
import MessageToast from "sap/m/MessageToast";
import ProductRating, {
  ProductRating$ChangeEvent,
} from "../control/ProductRating";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import JSONModel from "sap/ui/model/json/JSONModel";
/**
 * @namespace ui5.walkthrough.controller
 */
export default class Detail extends Controller {
  onInit(): void {
    const viewModel = new JSONModel({
      currency: "EUR",
    });
    const view = this.getView();
    if (view) {
      view.setModel(viewModel, "view");
    }
    const router = UIComponent.getRouterFor(this);
    const route = router.getRoute("detail");
    if (route) {
      route.attachPatternMatched(this.onObjectMatched, this);
    }
  }

  onObjectMatched(event: Route$PatternMatchedEvent): void {
    (<ProductRating>this.byId("rating")).reset();
    const view = this.getView();
    if (view) {
      view.bindElement({
        path:
          "/" +
          window.decodeURIComponent(
            (event.getParameter("arguments") as any).invoicePath
          ),
        model: "invoice",
      });
    }
  }
  onNavBack(): void {
    const history = History.getInstance();
    const previousHash = history.getPreviousHash();

    if (previousHash !== undefined) {
      window.history.go(-1);
    } else {
      const router = UIComponent.getRouterFor(this);
      router.navTo("overview", {}, true);
    }
  }
  onRatingChange(event: ProductRating$ChangeEvent): void {
    const value = event.getParameter("value");
    const view = this.getView();
    const i18nModel = view?.getModel("i18n") as ResourceModel | undefined;
    const resourceBundle = <ResourceBundle>i18nModel?.getResourceBundle();

    if (resourceBundle) {
      MessageToast.show(
        <string>resourceBundle.getText("ratingConfirmation", [value])
      );
    }
  }
}
