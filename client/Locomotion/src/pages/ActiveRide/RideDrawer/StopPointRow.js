import React from 'react';
// import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';

import i18n from '../../../I18n';

const address = `
min-height: 50;
padding-top: 10;
padding-bottom: 10;
padding-start: 24;
align-items: center;
flex-direction: row;
`;

export const StopPointDot = styled.View`
  width: 10;
  height: 10;
  background-color: ${({ origin }) => (origin ? '#8ac1ff' : '#02cc64')};
  border-radius: 10;
  /* margin-top: 10; */
`;


export const PickupRow = styled.View`
${address}
border-bottom-color: #f2f2f2;
border-bottom-width: 1;
`;

const StopPointDotContainer = styled.View`
  position: absolute;
  left: 16;
  ${({ origin }) => (origin ? 'bottom: -1;' : 'top: 0;')}
  justify-content: center;
  align-items: center;
  ${({ origin }) => (origin ? '' : 'flex-direction: column-reverse;')}
  width: 20;
  height: 100%;
`;

const StopPointDotTimeLine = styled.View`
  width: 1;
  flex: 1;
  background-color: #8aecff;
`;

const AddressText = styled.Text`
  font-size: 13;
  color: #666666;
  margin-start: 22;
  margin-end: 16;
`;

const EtaText = styled.Text`
  font-size: 13;
  color: #808080;
  margin-start: 46;
  top: 30px;
  position: absolute;
  font-size: 10px;
  /* display: none; */
`;

const StopPointRowContainer = styled.TouchableOpacity`
  min-height: 50;
  padding-top: 10;
  padding-bottom: 10;
  padding-start: 24;
  align-items: center;
  flex-direction: row;
  ${({ pickup }) => (pickup ? `
    border-bottom-color: #f2f2f2;
    border-bottom-width: 1;
  ` : null)}
`;

export default ({
  pickup, description, eta, completedAt, openLocationSelect,
}) => (
  <StopPointRowContainer pickup={pickup} onPress={openLocationSelect}>
    <StopPointDotContainer origin={pickup}>
      <StopPointDot origin={pickup} />
      <StopPointDotTimeLine />
    </StopPointDotContainer>
    {eta || completedAt ? (
      <EtaText>
        {moment(eta || completedAt).fromNow() }
      </EtaText>
    ) : null }
    <AddressText>
      {description || i18n.t(pickup ? 'home.choosePickup' : 'home.chooseDropoff')}
    </AddressText>
  </StopPointRowContainer>
);
