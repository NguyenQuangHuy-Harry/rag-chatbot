import { useState } from "react";

const Footer = () => {
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    try {
      setLoading(true);

      await fetch("/api/ingest", {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="chatbot-text-tertiary flex justify-between text-sm mt-6">
      <button
        type="button"
        disabled={loading}
        onClick={handleScrape}
        className="mr-2 chatbot-send-button flex rounded-md items-center justify-center origin:px-3"
      >
        {loading ? (
          <svg
            className="animate-spin"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M2.925 5.025L9.18333 7.70833L2.91667 6.875L2.925 5.025ZM9.175 12.2917L2.91667 14.975V13.125L9.175 12.2917ZM1.25833 2.5L1.25 8.33333L13.75 10L1.25 11.6667L1.25833 17.5L18.75 10L1.25833 2.5Z" />
          </svg>
        )}
        <span className="hidden origin:block font-semibold text-sm ml-2">
          {loading ? "Scraping..." : "Scrape Pagefly data"}
        </span>
      </button>

      <a
        className=" vercel-link flex h-8 w-max flex-none items-center justify-center border rounded-md text-xs"
        aria-label="Deploy on Vercel"
        href="https://vercel.com/templates/next.js/ragbot-starter"
      >
        <span className="px-3">▲</span>
        <hr className="h-full border-r" />
        <span className="px-3">Deploy</span>
      </a>
      <div className="ml-auto flex flex-row items-center">
        <span className="mr-1">Powered by</span>
        <svg
          aria-label="DataStax logotype"
          width="87"
          height="9"
          viewBox="0 0 87 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_209_2925)">
            <g clipPath="url(#clip1_209_2925)">
              <g clipPath="url(#clip2_209_2925)">
                <path
                  d="M52.1707 1.9231V0.539429H45.5293L43.7258 1.9231V3.82314L45.5293 5.20681H51.3174V7.15719H44.0845V8.53943H50.9052L52.7087 7.15719V5.20681L50.9052 3.82314H45.1172V1.9231H52.1707Z"
                  fill="#6B6F73"
                />
                <path
                  d="M17.4079 0.539429H16.1409L11.494 8.53943H13.1008L16.7773 2.21221L20.4494 8.53943H22.0548L17.4079 0.539429Z"
                  fill="#6B6F73"
                />
                <path
                  d="M31.2213 0.539429H22.2384V1.9231H26.0349V8.53943H27.4248V1.9231H31.2213V0.539429Z"
                  fill="#6B6F73"
                />
                <path
                  d="M63.9232 0.539429H54.9418V1.9231H58.7368V8.53943H60.1281V1.9231H63.9232V0.539429Z"
                  fill="#6B6F73"
                />
                <path
                  d="M7.93033 0.539429H0.750977V8.53943H7.93033L9.73385 7.15575V1.9231L7.93033 0.539429ZM2.1423 1.9231H8.34252V7.15719H2.1423V1.9231Z"
                  fill="#6B6F73"
                />
                <path
                  d="M80.353 4.53943L79.5489 3.15575V3.15719L78.0288 0.539429H76.422L78.7462 4.53943L76.422 8.53943H78.0288L79.5489 5.9231L80.353 4.53943Z"
                  fill="#6B6F73"
                />
                <path
                  d="M82.6382 4.53943L83.4423 3.15575V3.15719L84.9638 0.539429H86.5692L84.2465 4.53943L86.5692 8.53943H84.9638L83.4423 5.9231L82.6382 4.53943Z"
                  fill="#6B6F73"
                />
                <path
                  d="M36.0519 0.539429H37.3189L41.9658 8.53943H40.359L36.6825 2.21221L33.0104 8.53943H31.405L36.0519 0.539429Z"
                  fill="#6B6F73"
                />
                <path
                  d="M68.7538 0.539429H70.0208L74.6677 8.53943H73.0623L69.3844 2.21221L65.7138 8.53943H64.1069L68.7538 0.539429Z"
                  fill="#6B6F73"
                />
              </g>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_209_2925">
              <rect
                width="85.8182"
                height="8"
                fill="white"
                transform="translate(0.750977 0.539429)"
              />
            </clipPath>
            <clipPath id="clip1_209_2925">
              <rect
                width="85.8388"
                height="8"
                fill="white"
                transform="translate(0.750977 0.539429)"
              />
            </clipPath>
            <clipPath id="clip2_209_2925">
              <rect
                width="85.8182"
                height="8"
                fill="white"
                transform="translate(0.750977 0.539429)"
              />
            </clipPath>
          </defs>
        </svg>
        <span className="mx-1">and</span>
        <svg
          aria-label="Vercel logotype"
          width="53"
          height="13"
          viewBox="0 0 53 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_209_2927)">
            <path
              d="M26.7255 3.53942C24.6874 3.53942 23.2178 4.86865 23.2178 6.86249C23.2178 8.85634 24.872 10.1856 26.9101 10.1856C28.1415 10.1856 29.2271 9.69819 29.8991 8.87665L28.4868 8.06065C28.1138 8.46865 27.5471 8.7068 26.9101 8.7068C26.0258 8.7068 25.2745 8.24526 24.9957 7.5068H30.1686C30.2092 7.30003 30.2332 7.08588 30.2332 6.86065C30.2332 4.86865 28.7637 3.53942 26.7255 3.53942ZM24.9791 6.21634C25.2098 5.47973 25.8412 5.01634 26.7237 5.01634C27.608 5.01634 28.2394 5.47973 28.4683 6.21634H24.9791ZM46.6049 3.53942C44.5668 3.53942 43.0972 4.86865 43.0972 6.86249C43.0972 8.85634 44.7514 10.1856 46.7895 10.1856C48.0209 10.1856 49.1064 9.69819 49.7784 8.87665L48.3661 8.06065C47.9932 8.46865 47.4265 8.7068 46.7895 8.7068C45.9052 8.7068 45.1538 8.24526 44.8751 7.5068H50.048C50.0886 7.30003 50.1126 7.08588 50.1126 6.86065C50.1126 4.86865 48.6431 3.53942 46.6049 3.53942ZM44.8603 6.21634C45.0911 5.47973 45.7225 5.01634 46.6049 5.01634C47.4892 5.01634 48.1206 5.47973 48.3495 6.21634H44.8603ZM37.6548 6.86249C37.6548 7.97019 38.3785 8.70865 39.5009 8.70865C40.2615 8.70865 40.832 8.36342 41.1255 7.80034L42.5434 8.61819C41.9563 9.59665 40.856 10.1856 39.5009 10.1856C37.4609 10.1856 35.9932 8.85634 35.9932 6.86249C35.9932 4.86865 37.4628 3.53942 39.5009 3.53942C40.856 3.53942 41.9545 4.12834 42.5434 5.1068L41.1255 5.92465C40.832 5.36157 40.2615 5.01634 39.5009 5.01634C38.3803 5.01634 37.6548 5.7548 37.6548 6.86249ZM52.8818 1.50865V10.001H51.2203V1.50865H52.8818ZM7.50892 0.585571L14.3305 12.401H0.687378L7.50892 0.585571ZM24.5637 1.50865L19.448 10.3702L14.3323 1.50865H16.2505L19.448 7.04711L22.6455 1.50865H24.5637ZM35.4394 3.72403V5.51296C35.2548 5.45942 35.0591 5.42249 34.8486 5.42249C33.776 5.42249 33.0025 6.16096 33.0025 7.26865V10.001H31.3409V3.72403H33.0025V5.42249C33.0025 4.48465 34.0935 3.72403 35.4394 3.72403Z"
              fill="#6B6F73"
            />
          </g>
          <defs>
            <clipPath id="clip0_209_2927">
              <rect
                width="52.4308"
                height="12"
                fill="white"
                transform="translate(0.569214 0.539429)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
