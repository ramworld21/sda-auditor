// @ts-nocheck

import {
  DgaBreadcrumbs,
  DgaButton,
  DgaCard,
  DgaDivider,
  DgaFeaturedIcon,
  DgaFooter,
  DgaHeaderActionBtn,
  DgaIcon,
  DgaNavHeader,
  DgaNavHeaderActions,
  DgaNavHeaderLink,
  DgaNavHeaderLogos,
  DgaNavHeaderMain,
  DgaNavHeaderMenu,
  DgaSecondNavHeader,
  DgaSecondNavHeaderActions,
  DgaSecondNavHeaderContent,
  DgaSecondNavHeaderItem,
} from "platformscode-new-react";
import { guid } from "../../../utils/guid";
import Feedback from "../Feedback";
import "../../../../node_modules/platformscode-new-react/dist/style.css";
import { useEffect, useState } from "react";

function Slider() {
  const numberInView = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inView, setinView] = useState([]);
  const [inLeftView, setInLeftView] = useState([]);
  const [inRightView, setInRightView] = useState([]);
  const card = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  useEffect(() => {
    if (currentIndex === 0) {
      setinView(() => card.slice(currentIndex * numberInView, numberInView));
      setInLeftView(() => {
        return card.slice(-numberInView);
      });
      setInRightView(() => {
        return card.slice(
          currentIndex * numberInView + numberInView,
          numberInView
        );
      });
    }
  }, [currentIndex]);

  return (
    <div>
      <div className="flex gap-[16px] md:-translate-x-[calc(100%/4-16px+(16px/4))] xl:-translate-x-[calc(100%/4-16px+(16px/4))/2] ">
        {card.map((_, i) => {
          return (
            <DgaCard
              key={i.toString()}
              cardTitle={"title"}
              description={"description"}
              primaryActionLabel={"action"}
              secondaryActionLabel={"action"}
            />
          );
        })}
      </div>
      <div className="dots mt-[36px] flex justify-center items-center gap-[8px]">
        <span className="size-[16px] inline-block rounded-full bg-[var(--stepper-button-completed,#1B8354)] cursor-pointer"></span>
        <span className="size-[16px] inline-block rounded-full bg-[var(--background-neutral-200,#E5E7EB)] cursor-pointer"></span>
        <span className="size-[16px] inline-block rounded-full bg-[var(--background-neutral-200,#E5E7EB)] cursor-pointer"></span>
      </div>
    </div>
  );
}

const Home = () => {
  return (
    <>
      <DgaSecondNavHeader variant="gray">
        <DgaSecondNavHeaderActions>
          <DgaButton
            label="Button"
            variant="transparent"
            iconType="mic-01"
            size="sm"
            iconOnly
          ></DgaButton>
          <DgaButton
            label="Button"
            variant="transparent"
            iconType="zoom-out-area"
            size="sm"
            iconOnly
          ></DgaButton>
           <DgaButton
            label="Button"
            variant="transparent"
            iconType="zoom-in-area"
            size="sm"
            iconOnly
          ></DgaButton>
           <DgaButton
            label="Button"
            variant="transparent"
            iconType="view"
            size="sm"
            iconOnly
          ></DgaButton>
        </DgaSecondNavHeaderActions>
        <DgaSecondNavHeaderContent>
          <DgaSecondNavHeaderItem label="Cloudy">
            <DgaIcon icon="cloud" variant="stroke" type="rounded" />
          </DgaSecondNavHeaderItem>
          <DgaSecondNavHeaderItem label="21 Jan 2024">
            <DgaIcon icon="calendar-04" variant="stroke" type="rounded" />
          </DgaSecondNavHeaderItem>
          <DgaSecondNavHeaderItem label="2:30 PM">
            <DgaIcon icon="time-04" variant="stroke" type="rounded" />
          </DgaSecondNavHeaderItem>
          <DgaSecondNavHeaderItem label="Al-Riyadh">
            <DgaIcon icon="location-01" variant="stroke" type="rounded" />
          </DgaSecondNavHeaderItem>
        </DgaSecondNavHeaderContent>
      </DgaSecondNavHeader>

      <DgaNavHeader fullWidth divider>
        <DgaNavHeaderMain collapsed>
          <DgaNavHeaderLogos
            logoSrc="https://dga-nds-fbhtx.ondigitalocean.app/mobile-logo.svg"
            //   govSrc="https://dga-nds-fbhtx.ondigitalocean.app/mobile-logo.svg"
            logoLink="#"
            govLink="#"
          ></DgaNavHeaderLogos>
          <DgaNavHeaderMenu>
            <DgaNavHeaderLink
              label="Item  1"
              icon="arrow-down-01"
              subMenuBackground="Brand"
              subMenuFullWidth=""
            >
              {" "}
            </DgaNavHeaderLink>
            <DgaNavHeaderLink
              label="Item  2"
              icon="arrow-down-01"
              subMenuBackground="Brand"
              subMenuFullWidth=""
            >
              {" "}
            </DgaNavHeaderLink>
            <DgaNavHeaderLink
              label="Item  3"
              icon="arrow-down-01"
              subMenuBackground="Brand"
              subMenuFullWidth=""
            >
              {" "}
            </DgaNavHeaderLink>
            <DgaNavHeaderLink
              label="Item  4"
              icon="arrow-down-01"
              subMenuBackground="Brand"
              subMenuFullWidth=""
            >
              {" "}
            </DgaNavHeaderLink>
            <DgaNavHeaderLink
              label="Item  5"
              icon="arrow-down-01"
              subMenuBackground="Brand"
              subMenuFullWidth=""
            >
              {" "}
            </DgaNavHeaderLink>
            <DgaNavHeaderLink
              label="Item  6"
              icon="arrow-down-01"
              subMenuBackground="Brand"
              subMenuFullWidth=""
            >
              {" "}
            </DgaNavHeaderLink>
            <DgaNavHeaderLink
              label="Item  7"
              icon="arrow-down-01"
              subMenuBackground="Brand"
              subMenuFullWidth=""
            >
              {" "}
            </DgaNavHeaderLink>
          </DgaNavHeaderMenu>
        </DgaNavHeaderMain>
        <DgaNavHeaderActions>
          <DgaHeaderActionBtn
            label="Search"
            icon="search-01"
          ></DgaHeaderActionBtn>
          <DgaHeaderActionBtn
            label="عربي"
            icon="translation"
          ></DgaHeaderActionBtn>
          <DgaHeaderActionBtn label="Login" icon="user"></DgaHeaderActionBtn>
        </DgaNavHeaderActions>
      </DgaNavHeader>

      <section
        className="max-h-[491px] h-[491px]"
        style={{
          background: `linear-gradient(0deg, rgba(9, 42, 30, 0.80) 0%, rgba(9, 42, 30, 0.80) 100%), url(https://www.state.gov/wp-content/uploads/2023/07/shutterstock_1938189982v2.jpg) lightgray 0px -189.624px / 100% 195.723% no-repeat`,
        }}
      >
        <div className="px-[196px] pt-[130px]">
          <h1 className="display-xl-semibold text-[#FFF]">Hero Section</h1>
          <p className="text-xl-regular text-[#FFF] mt-[24px] mb-[32px]">
            Here you can add a brief description about the purpose of the portal
            followed with a call to action button and an image or an
            illustration on the left hand side.
          </p>
          <DgaButton label="Primary Button" variant="secondary" size="lg" />
        </div>
      </section>

      <div className="pt-[40px] px-[16px] md:px-[80px]">
        <section className="mt-[24px]">
          <h1 className="display-sm-bold text-[#161616] mb-4">
            About us Section
          </h1>
          <p className="text-md-regular text-[#161616] mb-8">
            Here you can add a brief description about the purpose of the portal
            followed with a call to action button and an image or an
            illustration on the left hand side.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px] mt-[32px]">
            {[
              {
                showFeaturedIcon: false,
                title: "The Title of the News Card in two Lines",
                description:
                  "Here you can include a brief description of the headline in four lines. Here you can include a brief description of the headline in four lines.",
                image:
                  "https://saudigazette.com.sa/uploads/images/2023/11/02/2173406.jpg",
                primaryActionLabel: "Read More",
                showSecondaryAction: false,
              },
              {
                showFeaturedIcon: false,
                title: "The Title of the News Card in two Lines",
                description:
                  "Here you can include a brief description of the headline in four lines. Here you can include a brief description of the headline in four lines.",
                image:
                  "https://saudigazette.com.sa/uploads/images/2023/11/02/2173406.jpg",
                primaryActionLabel: "Read More",
                showSecondaryAction: false,
              },
              {
                showFeaturedIcon: false,
                title: "The Title of the News Card in two Lines",
                description:
                  "Here you can include a brief description of the headline in four lines. Here you can include a brief description of the headline in four lines.",
                image:
                  "https://saudigazette.com.sa/uploads/images/2023/11/02/2173406.jpg",
                primaryActionLabel: "Read More",
                showSecondaryAction: false,
              },
            ].map(({}) => (
              <div
                key={guid()}
                className="flex flex-col justify-center items-center"
              >
                <DgaFeaturedIcon icon={{
                  name:"user-group",
                  variant:"stroke",
                  type:"rounded"
                }} variant="light" color="brand" size="xl" />
                <h3 className="display-lg-regular text-[#14573A] mt-[24px]">
                  1.5M
                </h3>
                <p className="text-md-regular text-[#1F2A37] mt-[8px]">
                  Person
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-[24px] bg-[#F9FAFB] py-[40px]">
          <h1 className="display-sm-bold text-[#161616] mb-4">
            Services Section
          </h1>
          <p className="text-md-regular text-[#161616] mb-8">
            Here you can add a brief description about the purpose of the portal
            followed with a call to action button and an image or an
            illustration on the left hand side.
          </p>
          <Slider />
        </section>
        <section className="mt-[24px]">
          <h1 className="display-sm-bold text-[#161616] mb-4">
            Articles and News Section
          </h1>
          <p className="text-md-regular text-[#161616] mb-8">
            Here you can add a brief description about the purpose of the
            portal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                showFeaturedIcon: false,
                title: "The Title of the News Card in two Lines",
                description:
                  "Here you can include a brief description of the headline in four lines. Here you can include a brief description of the headline in four lines.",
                image:
                  "https://saudigazette.com.sa/uploads/images/2023/11/02/2173406.jpg",
                primaryActionLabel: "Read More",
                showSecondaryAction: false,
              },
              {
                showFeaturedIcon: false,
                title: "The Title of the News Card in two Lines",
                description:
                  "Here you can include a brief description of the headline in four lines. Here you can include a brief description of the headline in four lines.",
                image:
                  "https://saudigazette.com.sa/uploads/images/2023/11/02/2173406.jpg",
                primaryActionLabel: "Read More",
                showSecondaryAction: false,
              },
              {
                showFeaturedIcon: false,
                title: "The Title of the News Card in two Lines",
                description:
                  "Here you can include a brief description of the headline in four lines. Here you can include a brief description of the headline in four lines.",
                image:
                  "https://saudigazette.com.sa/uploads/images/2023/11/02/2173406.jpg",
                primaryActionLabel: "Read More",
                showSecondaryAction: false,
              },
            ].map(
              ({
                showFeaturedIcon,
                title,
                description,
                image,
                primaryActionLabel,
                showSecondaryAction,
              }) => (
                <DgaCard
                  key={guid()}
                  cardTitle={title}
                  description={description}
                  image={image}
                  showFeaturedIcon={showFeaturedIcon}
                  primaryActionLabel={primaryActionLabel}
                  showSecondaryAction={showSecondaryAction}
                />
              )
            )}
          </div>

          <p className="text-sm-regular text-right text-[#161616] py-[16px] mt-[40px]">
            Last Modified Date: 04/12/2020 - 4:13 PM Saudi Arabia Time
          </p>
        </section>

        <section className="py-[40px]">
          <h1 className="display-sm-bold text-[#161616] mb-4">
            Partner Section
          </h1>
          <div className="flex justify-between items-center">
            <DgaButton
              iconOnly
              iconType="arrow-left-01"
              iconProps={{ variant: "stroke", type: "standard" }}
              variant="secondary"
              size="lg"
            />
            <div className="rounded-[16px] border-[1px] border-[#D2D6DB] p-[16px]">
              <svg
                width="86"
                height="68"
                viewBox="0 0 86 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="85"
                  height="68"
                  transform="translate(0.699951)"
                  fill="white"
                />
                <path
                  d="M59.1772 25.4111C58.8041 25.1856 58.1241 24.8055 57.1853 24.4898C55.8313 24.0259 53.9417 23.678 51.7031 24.0581C50.9509 24.187 50.1565 24.3996 49.3321 24.7153C49.2538 24.7475 49.1756 24.7733 49.0974 24.8055C48.6762 24.973 48.2609 25.1792 47.8397 25.4047C47.4786 25.598 47.1236 25.8106 46.7685 26.0425C45.9561 26.5644 45.1557 27.1572 44.3794 27.8014C43.4948 22.0737 43.9281 16.7583 44.1327 14.1489C44.1327 14.136 44.1508 14.1296 44.1628 14.136C46.0584 15.4117 45.5288 18.9747 45.1256 19.9991C45.1196 20.0184 45.1437 20.0313 45.1618 20.0184C47.5207 17.0353 46.3713 13.7366 45.8839 12.9054C45.8719 12.8861 45.8959 12.8668 45.914 12.8797C46.257 13.176 46.5338 13.4917 46.7685 13.8139C47.4967 14.8125 47.7675 15.8885 47.8397 16.8421C47.8758 17.3446 47.8638 17.8085 47.8397 18.208C47.8337 18.3175 47.8276 18.4141 47.8156 18.5108C47.8156 18.5237 47.8276 18.5301 47.8397 18.5237C47.8457 18.5237 47.8517 18.5237 47.8517 18.5172C48.4896 17.1771 48.7965 15.154 47.8397 13.1889C47.5809 12.6542 47.2319 12.1258 46.7685 11.6169C46.6361 11.4687 46.4917 11.3269 46.3412 11.1787C46.3292 11.1659 46.3412 11.1401 46.3593 11.1465C46.5037 11.1852 46.6361 11.2303 46.7685 11.2754C47.1717 11.4236 47.5268 11.6297 47.8397 11.881C48.5558 12.448 49.0432 13.2211 49.3321 14.0329C49.5728 14.703 49.6811 15.3924 49.6811 16.0045C49.6811 16.0302 49.7112 16.0303 49.7172 16.0109C50.1625 14.2649 49.8917 12.9441 49.3321 11.9841C48.9349 11.2947 48.3873 10.7922 47.8397 10.4378C47.4666 10.1994 47.0935 10.0319 46.7685 9.92882C46.5759 9.86439 46.4074 9.82573 46.257 9.8064C46.2329 9.8064 46.2389 9.76775 46.263 9.76775C46.4375 9.74842 46.606 9.74197 46.7685 9.73553C47.1657 9.72909 47.5207 9.76775 47.8397 9.82573C48.4715 9.95459 48.965 10.1865 49.3321 10.4571C49.9339 10.8888 50.2348 11.3978 50.3371 11.604C50.3431 11.6233 50.3732 11.6104 50.3732 11.5911C50.2889 10.6698 49.8917 9.94815 49.3381 9.43271C48.9108 9.03325 48.3873 8.75621 47.8457 8.58869C47.4906 8.48561 47.1296 8.42763 46.7745 8.42118C46.2931 8.41474 45.8297 8.49849 45.4386 8.67889C45.4205 8.68534 45.4085 8.66601 45.4145 8.64668C45.7635 8.11192 46.257 7.78978 46.7745 7.61582C47.1356 7.49985 47.5027 7.45474 47.8457 7.48051C48.1767 7.49984 48.4776 7.57715 48.7243 7.69957C48.7424 7.70601 48.7544 7.68669 48.7423 7.66736C48.4715 7.33878 48.1646 7.08105 47.8457 6.88777C47.5027 6.68159 47.1416 6.55918 46.7745 6.51408C45.8177 6.39811 44.8428 6.83623 44.1929 7.88642C44.1869 7.89931 44.1688 7.89931 44.1628 7.88642C44.0364 7.64803 43.9161 7.38387 43.8077 7.10682C43.549 6.46253 43.3384 5.74093 43.224 5.01933C43.218 4.99356 43.1939 4.99356 43.1939 5.01933C43.0796 5.74093 42.863 6.46898 42.6042 7.11327C42.4898 7.39032 42.3755 7.64804 42.2491 7.87998C42.2431 7.89287 42.2251 7.89287 42.219 7.87998C41.0877 6.04375 38.9634 6.08241 37.6696 7.66736C37.6576 7.68025 37.6696 7.70601 37.6876 7.69957C38.5482 7.26145 40.179 7.39031 40.9974 8.64668C41.0095 8.66601 40.9914 8.68534 40.9734 8.67889C39.7156 8.11192 37.7659 8.47916 36.7248 9.8064C36.3517 10.2767 36.0989 10.8759 36.0327 11.5911C36.0327 11.6104 36.0568 11.6233 36.0689 11.604C36.1471 11.4429 36.3517 11.095 36.7248 10.7406C37.3326 10.1672 38.3917 9.58735 40.1429 9.76131C40.167 9.76775 40.167 9.79996 40.1489 9.79996C39.2523 9.91594 37.4048 10.7728 36.7248 12.7315C36.4239 13.5948 36.3457 14.6772 36.6827 16.0045C36.6887 16.0238 36.7188 16.0238 36.7188 15.998C36.7188 15.9658 36.7188 15.9401 36.7248 15.9078C36.7428 14.1296 37.6937 11.7457 40.0466 11.1401C40.0647 11.1336 40.0767 11.1594 40.0647 11.1723C37.4349 13.6464 37.6937 16.7003 38.5542 18.5043C38.5662 18.5237 38.5903 18.5172 38.5903 18.4979C38.476 17.132 38.3857 14.703 40.4919 12.8668C40.51 12.8539 40.5341 12.8732 40.522 12.8926C40.0346 13.7301 38.8852 17.0225 41.2442 20.0055C41.2562 20.0249 41.2863 20.012 41.2803 19.9862C40.8831 18.9682 40.3535 15.3988 42.2431 14.1231C42.2551 14.1167 42.2732 14.1232 42.2732 14.136C42.4778 16.7454 42.9111 22.0608 42.0265 27.7886C40.504 26.5386 38.8972 25.4433 37.3085 24.799C37.1099 24.7217 36.9174 24.6509 36.7308 24.58C35.088 24.0001 33.5835 23.8391 32.2716 23.9035C30.1654 24.0001 28.5526 24.6766 27.668 25.147C27.4875 25.2436 27.337 25.3338 27.2227 25.4047C27.1745 25.4369 27.2106 25.5078 27.2588 25.4884C27.3972 25.4433 27.5296 25.3982 27.668 25.3596C29.2868 24.8699 30.8213 24.7411 32.2716 24.8764C33.8543 25.0245 35.3407 25.4884 36.7308 26.1585C38.6806 27.0992 40.4438 28.4393 42.0385 29.8567C39.7879 31.9571 37.8862 33.9995 36.7308 34.7147C36.6706 34.7469 36.6165 34.7856 36.5623 34.8178C36.2855 34.4119 35.8041 34.1799 35.2805 34.3023C34.8232 34.4119 34.4501 34.8049 34.3478 35.2881C34.2575 35.7198 34.3598 36.1901 34.5885 36.4349C35.2023 37.0921 35.9124 37.1372 36.7308 36.77C38.2894 36.0677 40.2272 33.8642 42.6042 31.5319C42.8028 31.3386 43.0014 31.1389 43.206 30.9456C43.4106 31.1389 43.6092 31.3322 43.8077 31.5254C44.8849 32.5821 45.8718 33.6129 46.7745 34.4892C47.1476 34.85 47.5027 35.185 47.8457 35.4814C48.3753 35.9453 48.8747 36.3254 49.3381 36.5896C50.2468 37.105 51.0351 37.1694 51.7091 36.5316C51.7452 36.4994 51.7813 36.4672 51.8174 36.4285C51.9739 36.261 52.1544 35.7133 52.0581 35.2817C52.004 35.0304 51.8776 34.8049 51.7031 34.6309C51.5466 34.4698 51.342 34.3474 51.1254 34.2959C50.6018 34.1735 50.1204 34.4054 49.8436 34.8113C49.6871 34.7276 49.5186 34.6116 49.3321 34.4763C48.9048 34.1606 48.4054 33.716 47.8397 33.1877C47.5027 32.872 47.1476 32.5241 46.7685 32.1568C46.0343 31.4417 45.2279 30.6556 44.3734 29.8503C45.1317 29.1738 45.932 28.5166 46.7685 27.911C47.1175 27.6597 47.4726 27.4149 47.8397 27.1829C48.3271 26.8737 48.8206 26.5902 49.3321 26.326C50.0963 25.933 50.8847 25.6044 51.7031 25.3531C53.4001 24.8313 55.2235 24.6573 57.1853 24.9923C57.8232 25.1019 58.4731 25.2629 59.1411 25.482C59.1893 25.5142 59.2254 25.4433 59.1772 25.4111Z"
                  fill="#9DA4AE"
                />
              </svg>
            </div>
            <div className="rounded-[16px] border-[1px] border-[#D2D6DB] p-[16px]">
              <svg
                width="86"
                height="68"
                viewBox="0 0 86 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="85"
                  height="68"
                  transform="translate(0.699951)"
                  fill="white"
                />
                <path
                  d="M59.1772 25.4111C58.8041 25.1856 58.1241 24.8055 57.1853 24.4898C55.8313 24.0259 53.9417 23.678 51.7031 24.0581C50.9509 24.187 50.1565 24.3996 49.3321 24.7153C49.2538 24.7475 49.1756 24.7733 49.0974 24.8055C48.6762 24.973 48.2609 25.1792 47.8397 25.4047C47.4786 25.598 47.1236 25.8106 46.7685 26.0425C45.9561 26.5644 45.1557 27.1572 44.3794 27.8014C43.4948 22.0737 43.9281 16.7583 44.1327 14.1489C44.1327 14.136 44.1508 14.1296 44.1628 14.136C46.0584 15.4117 45.5288 18.9747 45.1256 19.9991C45.1196 20.0184 45.1437 20.0313 45.1618 20.0184C47.5207 17.0353 46.3713 13.7366 45.8839 12.9054C45.8719 12.8861 45.8959 12.8668 45.914 12.8797C46.257 13.176 46.5338 13.4917 46.7685 13.8139C47.4... (file continues)
