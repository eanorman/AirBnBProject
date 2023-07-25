import React, { useState, useContext, createContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({children}) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);



    return(
        <ModalContext.Provider value={{showLoginModal, setShowLoginModal, showSignupModal, setShowSignupModal}}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const {showLoginModal, setShowLoginModal, showSignupModal, setShowSignupModal} = useContext(ModalContext);

    return {showLoginModal, setShowLoginModal,showSignupModal, setShowSignupModal}
}