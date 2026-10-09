import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { environment } from '../../../src/environments/environment';

export interface UserProfile {
  uid: string;
  email: string;
  nom: string;
  prenom: string;
  age: number;
  photoUrl: string;
  role: 'user' | 'admin';
  active: boolean;
  favorites: number[]; // IDs des films favoris
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);

  constructor() {}

  // Inscription + sauvegarde du profil dans Firestore
  async register(
    email: string,
    pass: string,
    nom: string,
    prenom: string,
    age: number,
    photoUrl: string,
  ) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      pass,
    );
    const user = userCredential.user;

    const userData: UserProfile = {
      uid: user.uid,
      email,
      nom,
      prenom,
      age,
      photoUrl,
      role: 'user', // Rôle par défaut
      active: true, // Utilisateur actif
      favorites: [],
    };

    // Enregistrer le profil dans la collection "users" de Firestore
    await setDoc(doc(this.db, 'users', user.uid), userData);
    return user;
  }

  // Connexion
  async login(email: string, pass: string) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      pass,
    );
    const userDoc = await getDoc(
      doc(this.db, 'users', userCredential.user.uid),
    );

    if (userDoc.exists() && !userDoc.data()['active']) {
      await signOut(this.auth);
      throw new Error("Ce compte a été désactivé par l'administrateur.");
    }

    return userCredential.user;
  }
}
