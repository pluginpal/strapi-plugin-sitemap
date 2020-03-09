import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 2rem 3rem 1.8rem 3rem;
  background: #ffffff;
  box-shadow: 0 2px 4px #E3E9F3;
  margin-bottom: 3px;
  > div {
    margin-right: 0;
    margin-left: 0;
  }
  .row {
    margin-bottom: 4px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

export default Wrapper;
