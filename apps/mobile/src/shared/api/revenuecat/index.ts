/**
 * RevenueCat API
 */

export {
  initializeRevenueCat,
  loginToRevenueCat,
  logoutFromRevenueCat,
  getCustomerInfo,
  getOfferings,
  isPremiumActive,
  purchasePackage,
  restorePurchases,
  addSubscriptionListener,
  removeSubscriptionListener,
  invalidateCustomerInfoCache,
  ENTITLEMENT_ID,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from './client';
