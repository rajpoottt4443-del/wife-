import { SiteConfig } from '../types';

export const initialConfig: SiteConfig = {
  herName: "Meri Jaan",
  senderName: "Tera Pagal",
  favoriteTreat: "Ice Cream & Late Night Drive",
  songTitle: "Tum Se Hi (Romantic Lofi)",
  // High quality romantic instrumental preview link that works out-of-the-box
  // You can replace this with your local 'song.mp3' or any direct mp3 link
  songUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
  
  // Hero illustration/photo
  heroPhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80",
  
  photos: [
    {
      id: 1,
      // Replace with your photo: "photo1.jpg" or direct URL
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
      caption: "Tumhari ye smile meri jaan hai ❤️",
      rotation: "-rotate-2"
    },
    {
      id: 2,
      // Replace with your photo: "photo2.jpg" or direct URL
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=80",
      caption: "Sabse khoobsurat pal ✨",
      rotation: "rotate-2"
    },
    {
      id: 3,
      // Replace with your photo: "photo3.jpg" or direct URL
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
      caption: "Gusse mein bhi cute lagti ho 🥺",
      rotation: "-rotate-3"
    },
    {
      id: 4,
      // Replace with your photo: "photo4.jpg" or direct URL
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=80",
      caption: "Hamesha mere sath rehna ♾️",
      rotation: "rotate-3"
    }
  ],

  cards: [
    {
      id: "galti",
      title: "Meri Galti 🥺",
      subtitle: "Bina kisi bahane ke dil se maafi...",
      icon: "🥺",
      quote: "Galti meri hi thi, aur main usse poori tarah accept karta hoon.",
      fullMessage: "Mujhe sach mein ehsaas hai ki meri wajah se tumhara dil dukha. Mera koi bhi irada tumhe udas karne ka nahi tha, par meri baaton ya harkat se tumhe bura laga, aur iska mujhe dil se afsos hai. No excuses, no justifications—sirf tumse ek sachhi maafi maang raha hoon. Please mujhe maaf kar do na?"
    },
    {
      id: "ahmiyat",
      title: "Tumhari Ahmiyat 💖",
      subtitle: "Tum mere liye kitni special ho...",
      icon: "💖",
      quote: "Tum meri zindagi ka sabse khubsurat hissa ho.",
      fullMessage: "Jab tum mujhse baat nahi karti ya naraz hoti ho, toh lagta hai jaise poori duniya ruk gayi hai. Tumhari ek smile mere poore din ko roshan kar deti hai. Tum sirf meri girlfriend nahi, meri sabse achhi dost aur meri sukoon ho. Tumhare bina kuch bhi achha nahi lagta."
    },
    {
      id: "waada",
      title: "Mera Waada 🤞",
      subtitle: "Aane wale har kal ke liye...",
      icon: "🤞",
      quote: "Hamesha tumhara khayal rakhunga aur sununga.",
      fullMessage: "Main waada karta hoon ki aage se tumhari feelings ka aur zyada dhyaan rakhunga. Gussa aane se pehle samjhunga, tumhari baat dhyan se sununga aur tumhe kabhi intentionally hurt nahi hone dunga. Hum hamesha lad sakte hain, par kabhi ek doosre ka saath nahi chhodenge. Pinky promise!"
    }
  ]
};
