import {Dimensions} from 'react-native';
import SVGLoginLogo from './login-logo.svg';
import SVGMenuLogoSquare from './logo-square.svg';
import SVGHome from './homeicon.svg';
import SVGNotification from './notification.svg';
import SVGHeart from './heart.svg';
import SVGProfile from './profile.svg';
import SVGMic from './mic.svg';
import SVGMenu from './menu.svg';
import SVGSearch from './search.svg';
import SVGOrderIcon from './myOrders.svg';

import SVGDriver from './drivericon.svg';
import SVGTrack from './trackicon.svg';
import SVGCatalog from './catalogicon.svg';

import SVGPizzBrug from './Home/PizzaBrug.svg';
import SVGJuiceClub from './Home/JuiceClub.svg';
import AddIconWithBg from './addIconwithbg.svg';
import CurrentLocationIcon from './currentLocation.svg';
import SVGBurger from './Home/Burger.svg';
import NoteIcon from './noteIcon.svg';
import SVGHealthyFood from './Home/HealthyFood.svg';
import SVGKidsFood from './Home/KidsFood.svg';
import SVGRegularFood from './Home/RegularFood.svg';
import SVGFastFood from './Home/FastFood.svg';
import SVGOffers from './Home/Offers.svg';
import SVGNearbyRestaurant1 from './Home/NearbyRestaurant1.svg';
import SVGNearbyRestaurant2 from './Home/NearbyRestaurant2.svg';
import SVGPopularItems1 from './Home/PopularItems1.svg';
import SVGPopularItems2 from './Home/PopularItems2.svg';
import SVGPopularItems3 from './Home/PopularItems3.svg';
import SVGPopularItems4 from './Home/PopularItems4.svg';
import SVGProfilePic from './Home/ProfilePic.svg';
import SVGCart from './cart.svg';
import SVGComingSoon from './coming_soon.svg';
import Group594 from './Group594.svg';
import Group593 from './Group593.svg';
import BlueDot from './blueDot.svg';
import SVGLoader from './loader.svg';
import SVGHandwave from './handwave.svg';
import SVGStarIcon from './starIcon.svg';
import SVGOfferIcon from './offerIcon.svg';
import SVGWaveIcon from './waveIcon.svg';
import SVGHeartIcon from './heartIcon.svg';
import SVGSlideOne from './slideone.svg';
import SVGSlideTwo from './slideTwo.svg';
import SVGSlideThree from './slide3.svg';
import SVGDeliveryMan from './deliveryMan.svg';
import SVGRoad from './road.svg';
import SVGCatalogAddButton from './addCatalogButton.svg';
import SVGNotificationIcon from './notification.svg';
import SVGDeliveriesIcon from './deliveryIcon.svg';
import SVGAddDriver from './addDriver.svg';
import SVGdriverIcon from './user_icon.svg';
import SVGPhoneIcon from './phone_Icon.svg';
import SVGOutOfStock from './outofstock.svg';
import SVGArrowLeft from './arrow-left.svg';
import SVGTrackIcon from './logo5_23_1211.svg';
import SVGUserIcon from './person-circle.svg';

import SVGMembership from './membership.svg';
import SVGPrivcacyPolicy from './privcacy_policy.svg';
import SVGPaymentMethod from './payment_method.svg';
import SVGLanguage from './language.svg';
import SVGBusinessInfo from './business_info.svg';
import SVGBorderedCircleIcon from './circleBorderedIcon.svg';
import SVGBrokenBar from './brokenLine.svg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AppImages = {
  congratulation: {
    source: require('./Congratulation.gif'),
    style: {
      width: 200,
      height: 200,
    },
  },
  splash: {
    source: require('./splash.gif'),
    style: {
      width: windowWidth,
      height: windowHeight,
    },
  },
  comingSoon: {
    source: require('./coming_soon.png'),
    style: {
      aspectRatio: 2 / 3,
    },
  },
  supplierThumbnail: {
    source: require('./supplierThumbnail.png'),
  },
  noImg: {
    source: require('./placeholder.png'),
  },
};

export {
  SVGLoginLogo,
  SVGMenuLogoSquare,
  SVGHome,
  SVGNotification,
  SVGHeart,
  SVGProfile,
  AppImages,
  SVGMic,
  SVGMenu,
  SVGSearch,
  SVGPizzBrug,
  SVGJuiceClub,
  SVGBurger,
  SVGStarIcon,
  SVGOfferIcon,
  SVGWaveIcon,
  AddIconWithBg,
  CurrentLocationIcon,
  NoteIcon,
  SVGHealthyFood,
  SVGTrackIcon,
  Group594,
  Group593,
  SVGKidsFood,
  SVGRegularFood,
  SVGSlideOne,
  SVGSlideTwo,
  SVGSlideThree,
  SVGLoader,
  BlueDot,
  SVGHeartIcon,
  SVGFastFood,
  SVGOffers,
  SVGNearbyRestaurant1,
  SVGNearbyRestaurant2,
  SVGPopularItems1,
  SVGPopularItems2,
  SVGPopularItems3,
  SVGBorderedCircleIcon,
  SVGAddDriver,
  SVGUserIcon,
  SVGCatalogAddButton,
  SVGPopularItems4,
  SVGProfilePic,
  SVGCart,
  SVGComingSoon,
  SVGDriver,
  SVGNotificationIcon,
  SVGDeliveriesIcon,
  SVGDeliveryMan,
  SVGRoad,
  SVGBrokenBar,
  SVGTrack,
  SVGdriverIcon,
  SVGPhoneIcon,
  SVGOutOfStock,
  SVGCatalog,
  SVGHandwave,
  SVGMembership,
  SVGPrivcacyPolicy,
  SVGArrowLeft,
  SVGPaymentMethod,
  SVGLanguage,
  SVGBusinessInfo,
  SVGOrderIcon,
};
