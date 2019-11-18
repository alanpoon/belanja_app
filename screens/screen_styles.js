import styled from 'styled-components';
export const Wrapper=styled.div`
border: 2px solid #eee;
border-radius: 8px;
margin: 10px;
width: 280px;
overflow: hidden;
`;
export const ItemImageWrapper = styled.div`
  height: 180px;
  line-height: 100px;
  text-align: center;

  img {
    height: 100%;
    width: 100%;
  }
`;
export const ItemDescWrapper = styled.div`
  padding: 10px;
`;
export const ActionWrapper =styled.div`
margin-top: 10px;
padding-bottom: 10px;
border-bottom: 1px solid #e4e4e4;
h2 {
  display: inline-block;
}
`;