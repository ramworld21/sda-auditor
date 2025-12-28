import {
  DgaButton as Button,
  DgaTextarea as Textarea,
  DgaLink,
  DgaIcon,
  DgaRating,
} from "platformscode-new-react";

import React, { ChangeEvent, useState } from "react";

import "../../../../node_modules/platformscode-new-react/dist/style.css";

interface IAnswer {
  rating: number;
  feedback: string;
}

const RatingTemplate: React.FC = () => {
  const [answer, setAnswer] = useState<IAnswer>({
    rating: 0,
    feedback: "",
  });

  const [openQuestions, setOpenQuestions] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className=" w-full m-auto flex flex-col gap-8 px-[24px] md:px-[80px] py-[24px]">
      {!openQuestions && !submitted && (
        <div className="w-full max-md:flex-col max-md:gap-4 flex md:items-center md:justify-between">
          <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6">
            <p className="text-md-regular text-[#161616]">
              This service is rated with an average of{" "}
              <span className="text-md-bold">3.9</span>
            </p>

            <div className="flex items-center gap-[8px]">
              <DgaRating variant="Brand" rating={3.5} readOnly />

              <p className="text-sm-regular text-[#6C737F]">1544 reviews</p>
            </div>
          </div>

          <Button
            label="Rate this service"
            variant="primary-brand"
            size="lg"
            onClick={() => {
              setOpenQuestions(true);
            }}
          />
        </div>
      )}

      {openQuestions && !submitted && (
        <div className="flex flex-col gap-8">
          <div className="w-full flex max-md:flex-col-reverse items-start max-md:gap-6 md:justify-between">
            <div className="flex flex-col gap-4 max-w-[742px]">
              <h4 className="text-md-semibold text-[#161616]">
                Tell us what you think of this service
              </h4>
              <p className="text-md-regular text-[#161616] flex gap-[3px] ">
                Please don’t include personal or financial information. Your
                review will be submitted and recorded to improve services.
              </p>
            </div>
            <Button
              label="Close"
              variant="subtle"
              trailIcon
              trailIconType="cancel-circle"
              trailIconProps={{ variant: "stroke", type: "standard" }}
              size="lg"
              onClick={() => setOpenQuestions(false)}
              className="max-md:ml-auto"
            />
          </div>

          <div className="w-full flex items-center justify-between">
              <div className="w-full flex justify-between max-md:flex-col max-md:gap-8">
                <div className="flex flex-col gap-4">
                  <h4 className="text-md-semibold text-[#161616]">
                    How would you rate this service?
                  </h4>
                  <p className="text-md-regular text-[#6C737F] py-2 flex gap-[3px] ">
                    Rate your experience from (1) poor to (5) excellent
                  </p>

                  <DgaRating variant="Brand" rating={answer.rating} onChange={(rating: number) => setAnswer({...answer , rating})} />

                </div>

                <Textarea
                  label="Feedback"
                  value={answer.feedback}
                  scrollbar
                  resize
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAnswer({ ...answer, feedback: e.target.value })
                  }
                  variant="default"
                  placeholder="text placeholder"
                />
              </div>
          </div>

          <div className="w-full flex justify-between md:items-center max-md:flex-col max-md:gap-8">
            <p className="flex flex-wrap text-md-regular text-[#161616] py-2 gap-[3px]">
              For more information you may review
              <DgaLink
                external
                label="e-participation statement"
                size="md"
                target="_blank"
                url="https://design.dga.gov.sa/components/feedback"
                variant="brand"
              />
              <span className="mx-[7px]">and</span>
              <DgaLink
                external
                label="rules of engagement."
                size="md"
                target="_blank"
                url="https://design.dga.gov.sa/components/feedback"
                variant="brand"
              />
            </p>

            <Button
              label="Submit"
              size="lg"
              variant="primary-brand"
              onClick={() => setSubmitted(true)}
            />
          </div>
        </div>
      )}

      {submitted && (
        <div className="w-full flex max-md:flex-col md:items-center max-md:gap-4 md:justify-between">
          <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6">
            <p className="text-md-regular text-[#161616]">
              You rated this service as {" "}
              <span className="text-md-bold">({answer.rating})</span>
            </p>

            <DgaRating variant="Brand" rating={answer.rating} readOnly />

          </div>

          <div className="w-fit flex items-center gap-6">
            <DgaIcon
              icon="checkmark-circle-04"
              variant="stroke"
              type="rounded"
              color="#1B8354"
              size="24px"
            />

            <p className="text-md-regular text-[#161616] whitespace-nowrap">
              Your feedback is submitted!
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default RatingTemplate;
