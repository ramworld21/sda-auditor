import { DgaButton, DgaFeaturedIcon, DgaLink } from "platformscode-new-react";
import { Switch } from "platformscode-react";
import { JSX, useState } from "react";

function CustomBanner({
  title,
  body,
  actions,
}: {
  title: string;
  body: () => JSX.Element;
  actions: () => JSX.Element;
}) {
  return (
    <div className="p-[32px] flex flex-col gap-[16px]">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-[8px]">
          <DgaFeaturedIcon
            icon={{
              name: "cookie",
              variant: "stroke",
              type: "rounded",
            }}
            variant="light"
            color="brand"
            size="md"
          />
          <h3 className="text-[var(--text-display,#1F2A37)] text-[18px] font-[600] leading-[28px]">
           {title}
          </h3>
        </div>
        <DgaButton
          iconOnly
          iconProps={{
            size: 24,
            variant: "stroke",
            type: "rounded",
          }}
          iconType="multiplication-sign"
          onClick={function Qa() {}}
          size="md"
          variant="subtle"
        />
      </div>
       {body()}
      <div className="flex flex-col gap-[8px] items-stretch w-full [&_button]:w-full">
      {actions()}
      </div>
    </div>
  );
}

function Banner() {
    const [cookiesState, setCookiesState] = useState<"manage"|"success" | "reject" |"accept">("accept")
  return (
    <div className="space-y-4">
        {cookiesState==="accept" && ( <CustomBanner
        title="Cookies"
        actions={() => {
          return (
            <>
              <DgaButton
                label="Accept"
                onClick={function Qa() {setCookiesState("success")}}
                size="md"
                variant="primary-brand"
              />
              <DgaButton
                label="Reject"
                onClick={function Qa() {setCookiesState("reject")}}
                size="md"
                variant="secondary-outline"
              />
              <DgaButton
                label="Manage Cookies"
                onClick={function Qa() {setCookiesState("manage")}}
                size="md"
                variant="transparent"
              />
            </>
          );
        }}
        body={() => (
          <p className="text-[var(--text-primary-paragraph,#384250)] text-[16px] font-[400] leading-[24px]">
            Use of Cookies by this site is just to guarantee Ease of Access and
            better user experience while browsing. Continuation of your browsing
            acknowledges your approval for Terms and Conditions of this site and
            its use of Cookies.{" "}
            <DgaLink
              external
              label="Privacy Policy"
              size="md"
              target="_blank"
              url="#"
              variant="brand"
            />
          </p>
        )}
      />
)}
{cookiesState==="manage" && (
    <CustomBanner
        title="Manage Cookies"
        actions={() => {
          return (
            <>
              <DgaButton
                label="Confirm My Choices"
                onClick={function Qa() {setCookiesState("success")}}
                size="md"
                variant="primary-brand"
              />
              <DgaButton
                label="Reject All"
                onClick={function Qa() {setCookiesState("reject")}}
                size="md"
                variant="secondary-outline"
              />
             
            </>
          );
        }}
        body={() => (
            <>
            
          <p className="text-[var(--text-primary-paragraph,#384250)] text-[16px] font-[400] leading-[24px]">
          When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer. 
          </p>
          <Switch
              color="brand"
              label="Strictly Necessary Cookies (Always Active)"
              onChange={() => {}}
              onInput={() => {}}
              checked
              disabled
            />
              <Switch
              color="brand"
              label="Performance Cookies"
              onChange={() => {}}
              onInput={() => {}}
              checked
            />
             <Switch
              color="brand"
              label="Functional Cookies"
              onChange={() => {}}
              onInput={() => {}}
              checked
            />
             <Switch
              color="brand"
              label="Targeting Cookies"
              onChange={() => {}}
              onInput={() => {}}
              checked
            />
            </>
        )}
      />
)}
{["reject","success"].includes(cookiesState)&& (

      <CustomBanner
        title="Manage Cookies"
        actions={() => {
          return (
            <>
                <DgaButton
                label="Undo"
                onClick={function Qa() {
                   
                        setCookiesState("accept")
                }}
                size="md"
                variant="transparent"
              />
             
            </>
          );
        }}
        body={() => (
            <>
            
          <p className="text-[var(--text-primary-paragraph,#384250)] text-[16px] font-[400] leading-[24px]">
          Thank you! Your response has been successfully recorded. If you wish to modify or change your answer, you can go back by clicking the Undo button.
          </p>
        
            </>
        )}
      />
)}
    </div>
  );
}

export default Banner;
