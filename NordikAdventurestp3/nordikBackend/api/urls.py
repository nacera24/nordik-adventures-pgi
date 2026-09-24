from django.urls import path
from . import (
    views,
    views_produits,
    views_stocks,
    views_auth,
    views_fournisseurs,
    views_commandes,
    views_panier,
    views_factures,
    views_commandes_client,
    views_satisfaction,
    views_magasinier,
    views_financier,
    views_service_client

    
)

urlpatterns = [
    path("test/", views.test, name="test"),

    # =========================
    # PRODUITS
    # =========================
    path("produits/", views_produits.get_produits),
    path("produits/<int:idProduit>/", views_produits.get_produit),
    path("produits/creer/", views_produits.creer_produit),
    path("produits/<int:idProduit>/modifier/", views_produits.modifier_produit),
    path("produits/<int:idProduit>/effacer/", views_produits.effacer_produit),
    path("produits/majfacture/", views.maj_facture),
    path("produits/historique/", views.get_historique_mvmt),
    path("produits/valeurtotalestock/", views_stocks.valeur_totale_stock),
    path("produits/reapprovisionnement/", views_stocks.produits_a_reapprovisionner),


    # =========================
    # AUTH
    # =========================
    path("auth/register-client/", views_auth.register_client),
    path("auth/login/", views_auth.login),
    path("clients/<int:client_id>/", views_auth.client_detail),

    # =========================
    # FOURNISSEURS
    # =========================
    path("fournisseurs/", views_fournisseurs.get_fournisseurs),
    path("fournisseurs/creer/", views_fournisseurs.creer_fournisseur),
    path("fournisseurs/<int:idFournisseur>/modifier/", views_fournisseurs.modifier_fournisseur),
    path("fournisseurs/<int:idFournisseur>/produits/", views_produits.get_produits_par_fournisseur),

    # =========================
    # COMMANDES D’ACHAT
    # =========================
    path("commandes-achat/", views_commandes.creer_commande_achat),
    path("commandes-achat/liste/", views_commandes.liste_commandes_a_recevoir),
    path("commandes-achat/<int:commande_id>/receptionner/", views_commandes.receptionner_commande),
    path("commandes-achat/<int:commande_id>/payer/", views_commandes.payer_commande_achat),
    path("commandes-achat/<int:commande_id>/", views_commandes.detail_commande_achat),

    # =========================
    # COMMANDES CLIENT 
    # =========================
    path("commandes-client/client/<int:client_id>/", views_commandes_client.commandes_client_liste),
    path("commandes-client/<int:commande_id>/", views_commandes_client.commande_client_detail),
    path("commandes-client/<int:client_id>/payer/", views_factures.payer_commande_client),

    # =========================
    # FACTURES
    # =========================
    path("factures/client/<int:client_id>/", views_factures.factures_client),
    path("factures/<int:facture_id>/", views_factures.facture_detail),

    # =========================
    # PANIER CLIENT
    # =========================
    path("paniers/client/<int:userId>/", views_panier.panier_client),
    path("paniers/client/<int:userId>/items/", views_panier.panier_client_add_item),
    path("paniers/items/<int:itemId>/", views_panier.panier_item_detail),
    path("paniers/<int:panierId>/items/", views_panier.panier_vider),

    # =========================
    # COMMANDES CLIENT (MAGASINIER)
    # =========================
    path("magasinier/commandes-clients/", views_commandes_client.commandes_clients_a_traiter),
    path(
        "magasinier/commandes-clients/<int:commande_id>/statut/",
        views_commandes_client.changer_statut_commande_client
    ),
    
    
    # =========================
    # SATISFACTION CLIENT
    # =========================
    path("satisfactions/", views_satisfaction.creer_satisfaction),
    
    
    # =========================
    #    DASHBOARD MAGASINIER
    # =========================
    path("magasinier/dashboard/", views_magasinier.dashboard_magasinier),


    # =========================
    #    DASHBOARD FINANCIER
    # =========================
    path("financier/dashboard/", views_financier.dashboard_financier),
    
    
    
    # CRM ----- Service client -----
    path("crm/clients/", views_service_client.crm_liste_clients),
    path("crm/clients/<int:client_id>/", views_service_client.crm_client_detail),
    path("crm/clients/<int:client_id>/activites/", views_service_client.crm_ajouter_activite),

]
