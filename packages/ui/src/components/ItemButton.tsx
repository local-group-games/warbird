import styled from "@emotion/styled";

export type ItemButtonProps = {
  backgroundColor: string;
};

export const ItemButton = styled.div<ItemButtonProps>`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 8px;
  line-height: 30px;
  text-align: center;
  background-color: ${props => props.backgroundColor || "#ffffff"};
`;
