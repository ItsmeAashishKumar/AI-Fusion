'use client';
import React, { useEffect, useState } from 'react';
import AppHeader from './_components/AppHeader';
import { useUser } from '@clerk/nextjs';
import { doc, getDoc, setDoc,updateDoc  } from 'firebase/firestore'
import { db } from '@/config/FirebaseDb';
import { AiSelectedModelContext } from '@/context/AiModelListContext';
import { DefaultModel } from '@/shared/AiModelShared';
import { UserDetailContext } from '@/context/UserDetailsContext';

function Provider({ children }) {

  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel)
  const [userDetails, setUserDetails] = useState()
  const { user, isLoaded, isSignedIn } = useUser();
  const [messages, setMessages] = useState({})

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      CreateUser();
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (aiSelectedModels) {
      updateAimodelSelectionPref()
    }
  }, [aiSelectedModels])

  const updateAimodelSelectionPref = async () => {
  if (!user?.primaryEmailAddress?.emailAddress) {
    console.error("No valid user email found. Cannot update preference.")
    return
  }

  const docRef = doc(db, "users", user.primaryEmailAddress.emailAddress)

  try {
    await updateDoc(docRef, {
      selectedModelPref: aiSelectedModels
    })
    console.log("AI model preference updated successfully!")
  } catch (error) {
    console.error("Error updating AI model preference:", error)
  }
}


  const CreateUser = async () => {
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      console.log("Existing User")
      const userInfo = docSnap.data()
      setAiSelectedModels(userInfo?.selectedModelPref ?? DefaultModel)
      setUserDetails(userInfo)
      return
    }
    else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress.emailAddress,
        createdAt: new Date(),
        remaining: 5,
        plan: 'Free',
        credits: 1000
      }
      await setDoc(userRef, userData)
      console.log("user created")
      setUserDetails(userData)
    }

  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <AiSelectedModelContext.Provider value={{ aiSelectedModels, setAiSelectedModels, messages, setMessages }}>
          <div className="flex-shrink-0">
            <AppHeader />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            {children}
          </div>
        </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;