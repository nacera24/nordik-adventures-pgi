import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import produitsReducer from "./produitsSlice";
import reapprovisionnementReducer from "./reapprovisionnementSlice";
import fournisseursReducer from "./fournisseursSlice";
import magasinierReducer from "./AccueilMagasinierSlice";
import magasinierCommandesClientReducer from "./magasinierCommandesClientSlice";
 

import commandeAchatReducer from "./commandeAchatSlice";
import dashboardFinancierReducer from "./dashboardFinancierSlice";
import clientReducer from "./clientSlice";
import panierClientReducer from "./panierClientSlice";
import factureClientReducer from "./factureClientSlice";
import commandeClientReducer from "./commandeClientSlice";
import satisfactionReducer from "./satisfactionClientSlice";

import serviceClientReducer from "./serviceClientSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    produits: produitsReducer,
    reapprovisionnement: reapprovisionnementReducer,

    fournisseurs: fournisseursReducer,
    magasinier: magasinierReducer,


    commandeAchat: commandeAchatReducer,

    dashboardFinancier: dashboardFinancierReducer,
    client: clientReducer, 
    panierClient: panierClientReducer,
    factureClient: factureClientReducer, 
    satisfaction: satisfactionReducer,
    magasinierCommandesClient: magasinierCommandesClientReducer,
    commandeClient: commandeClientReducer,
   
     
    serviceClient: serviceClientReducer,
  },
});

export default store;
