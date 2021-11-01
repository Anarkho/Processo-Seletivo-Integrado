import BaseController from "./baseController";

class UniversitiesController extends BaseController {
  constructor(University, apiRoot) {
    super(apiRoot, University);
  }
}

export default UniversitiesController;