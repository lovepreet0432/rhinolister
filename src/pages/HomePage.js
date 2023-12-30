import React,{ useMemo } from "react";
import {
  HomeBanner,
  Service,
  FeatureSection,
  Integrations,
  Scanner,
} from "../components/Home";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from 'react-redux';
import { styled } from "styled-components";


const HomePage = () => {
  document.title = "Home - Rhinolister";
  const home = useSelector(state => state.home);
  const memoizedHome = useMemo(() => home, [home]);
  
  if (!memoizedHome.home) {
    return (
      <Wrapper className='homepage-loader'>
        <div className="loader-container">
          <TailSpin height={80} width={80} />
        </div>
      </Wrapper>
    )
  }
   // Destructure home for cleaner code
   const { heading, content, scanContent, services, videoContent, shopify, ebay, amazon, hibid, whatnot } = memoizedHome.home;

  return (
    <>
      <HomeBanner heading={heading} content={content} />
      <Scanner content={scanContent} />
      <Service services={services} />
      <FeatureSection content={videoContent} />
      <Integrations shopifyList={shopify} ebayList={ebay} amazonList={amazon} hibidList={hibid} whatnotList={whatnot} />
    </>
  );
  
};

export default HomePage;

const Wrapper = styled.section`
  min-height:400px;
  display: flex;
  align-items: center;
  justify-content: center;
  .loader-container{    position: static;    transform: inherit;}
`;