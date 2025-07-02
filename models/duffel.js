const createOfferRequest = async (data) => {
  return await duffel.offerRequests.create(data);
};

const getOfferDetails = async (offerId) => {
  return await duffel.offers.get(offerId);
};

module.exports = {
  createOfferRequest,
  getOfferDetails,
};
