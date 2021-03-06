import React, { useContext, useState, useMemo} from 'react';
import styled from 'styled-components';
import { UserAddOutlined } from '@ant-design/icons';
import { Button, Tooltip, Avatar, Form, Input, Alert } from 'antd';
import Message from './message';
import { AppContext } from '../../context/appProvider';
import { AuthContext } from '../../context/authprovider';
import {addDocument} from '../firebase/services'
import useFirestore from '../../hook/useFireStore';

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid red;

    .header{
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &__title{
            margin: 0;
            font-weight: bold; 
        }

        &__description{
            font-size: 12px;
        }
        
    }
`;


const ButtonGroupStyled = styled.div`
    display: flex;  
    align-items: center;
`;

const WrapperStyled = styled.div`
    height: 100vh;
`;


const MessageListStyled = styled.div`
    max-height: 100%;
    overflow-y: auto;
`;

const ContentStyled = styled.div`
    height: calc(100% - 56px);   
    display: flex; 
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
  
`;


const FormStyled = styled(Form)`
    display: flex; 
    align-items: center;
    justify-content: space-between;
    padding: 2px 2px 2px 0;
    border-bottom: 1px solid red;
    border-radius: 2px;

    .ant-form-item{
        flex: 1;
        margin-bottom: 0;
    }
`;


export default function ChatWindow() {
    const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext)
    // console.log({rooms, selectedRoomId})

    // const selectedRoom = useMemo(() => rooms.find((room) => room.id === selectedRoomId), [rooms, selectedRoomId])

    const {user: { uid, photoURL, displayName }} = useContext(AuthContext);

    const [inputValue, setInputValue] = useState('');
    const [form] = Form.useForm();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
      };

    const handleOnSubmit = () => {
        addDocument('messages', {
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName,
    });
        form.resetFields(['message']);
    }

    const condition = useMemo(
        () => ({
          fieldName: 'roomId',
          operator: '==',
          compareValue: selectedRoom.id,
        }),
        [selectedRoom.id]
      );

    const messages = useFirestore('messages', condition);

    return (
        <WrapperStyled>
            {
                selectedRoom.id ? (
                    <>
                        <HeaderStyled>
                <div class="header__info">
                    <p class="header__title">{selectedRoom.name}</p>
                    <span class="header__description">{selectedRoom.description}</span>
                </div>
                <ButtonGroupStyled>
                    <Button icon={<UserAddOutlined />} type="text" onClick={() => setIsInviteMemberVisible(true)}>M???i</Button>
                    <Avatar.Group size="small" maxCount={2}>
                        {members.map((member) => (
                            <Tooltip title={member.displayName} key={member.id}>
                                <Avatar src={member.photoURL}>
                                    {member.photoURL
                                        ? ''
                                        : member.displayName?.charAt(0)?.toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                </ButtonGroupStyled>
            </HeaderStyled>
            <ContentStyled>
                <MessageListStyled>
                    {messages.map((mes) => (
                            <Message
                            key={mes.id}
                            text={mes.text}
                            photoURL={mes.photoURL}
                            displayName={mes.displayName}
                            createdAt={mes.createdAt}
                            />
                    ))}
                    {/* <Message text="Test" photoURL={null} displayName="Quynh" createdAt={12122122}></Message>
                    <Message text="Test1" photoURL={null} displayName="T?? d?? l??p" createdAt={12122122}></Message>
                    <Message text="Test2" photoURL={null} displayName="?????t l??u ?????n" createdAt={12122122}></Message>
                    <Message text="Test3" photoURL={null} displayName="Huy ph??n h???y" createdAt={12122122}></Message> */}
                </MessageListStyled>
                <FormStyled form={form}>
                    <Form.Item name='message'>
                        <Input
                            onChange={handleInputChange}
                            onPressEnter={handleOnSubmit}
                            placeholder="nh???p tin nh???n...." 
                            bordered={false} 
                            autoComplete="off"></Input>
                    </Form.Item>
                    <Button type="primary" onClick={handleOnSubmit}>G???i</Button>
                </FormStyled>
            </ContentStyled>
                    </>
                ) : <Alert message="H??y ch???n ph??ng" type="info" showIcon style={{margin: 5}} closable/> 
            }
            
        </WrapperStyled>
    )
}