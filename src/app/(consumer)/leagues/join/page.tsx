// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ArrowLeft, Group, Lock, Globe, Search, KeyBack } from "iconoir-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   type JoinPrivateLeagueFormValues,
//   joinPrivateLeagueSchema,
// } from "@/lib/schema";

// export default function JoinLeaguePage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<"private" | "public">("private");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<JoinPrivateLeagueFormValues>({
//     resolver: zodResolver(joinPrivateLeagueSchema),
//     defaultValues: {
//       join_code: "",
//     },
//   });

//   const onSubmitPrivate = async (data: JoinPrivateLeagueFormValues) => {
//     // Simuliamo l'invio dei dati
//     console.log("Join code:", data.join_code);

//     // In un'app reale, qui verificheresti il codice
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Redirect alla pagina della lega
//     router.push("/league-joined");
//   };

//   const onSubmitPublic = async () => {
//     // Redirect alla pagina di ricerca delle leghe pubbliche
//     router.push("/public-leagues");
//   };

//   return (
//     <main className="min-h-screen flex flex-col">
//       <header className="bg-gradient-to-b from-primary to-secondary px-6 relative">
//         <Link
//           href="/home"
//           className="flex items-center text-primary-foreground pt-12 mb-4"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           <span>Indietro</span>
//         </Link>

//         <div className="flex flex-col items-center py-8">
//           <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-6">
//             <Group className="w-10 h-10 text-primary-foreground" />
//           </div>
//           <h1 className="text-2xl font-heading text-center text-primary-foreground mb-2">
//             Benvenuto Presidente,
//           </h1>
//           <p className="text-center text-primary-foreground/90 mb-8">
//             sei pronto per una nuova sfida.
//           </p>
//         </div>
//       </header>

//       <div className="px-6 -mt-6 flex-1 pb-8">
//         <div className="bg-background rounded-2xl p-6 mb-6">
//           <div className="flex mb-6">
//             <button
//               onClick={() => setActiveTab("private")}
//               className={`flex-1 py-3 text-center rounded-l-lg transition-colors ${
//                 activeTab === "private"
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-muted text-muted-foreground"
//               }`}
//             >
//               <Lock className="inline-block w-4 h-4 mr-2" />
//               Lega Privata
//             </button>
//             <button
//               onClick={() => setActiveTab("public")}
//               className={`flex-1 py-3 text-center rounded-r-lg transition-colors ${
//                 activeTab === "public"
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-muted text-muted-foreground"
//               }`}
//             >
//               <Globe className="inline-block w-4 h-4 mr-2" />
//               Lega Pubblica
//             </button>
//           </div>

//           {activeTab === "private" ? (
//             <>
//               <div className="mb-6">
//                 <h2 className="text-lg font-heading mb-2">
//                   Unisciti a una Lega privata
//                 </h2>
//                 <p className="text-sm text-muted-foreground">
//                   Sai già a quale Lega unirti, hai ricevuto un invito o possiedi
//                   la parola d'ordine
//                 </p>
//               </div>

//               <form
//                 onSubmit={handleSubmit(onSubmitPrivate)}
//                 className="space-y-6"
//               >
//                 <div>
//                   <label
//                     htmlFor="join_code"
//                     className="block text-sm font-medium mb-2"
//                   >
//                     Codice di Invito
//                   </label>
//                   <div className="relative">
//                     <KeyBack className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//                     <Input
//                       id="join_code"
//                       placeholder="Inserisci il codice di invito"
//                       className="pl-10"
//                       {...register("join_code")}
//                     //   error={errors.join_code?.message}
//                     />
//                   </div>
//                   {errors.join_code && (
//                     <p className="text-destructive text-sm mt-1">
//                       {errors.join_code.message}
//                     </p>
//                   )}
//                 </div>

//                 <Button
//                   type="submit"
//                   variant="gradient"
//                   className="w-full"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Verifica in corso..." : "Unisciti alla Lega"}
//                 </Button>
//               </form>
//             </>
//           ) : (
//             <>
//               <div className="mb-6">
//                 <h2 className="text-lg font-heading mb-2">
//                   Unisciti a una Lega pubblica
//                 </h2>
//                 <p className="text-sm text-muted-foreground">
//                   Cerca una Lega a cui unirti e trova nuovi amici, magari della
//                   tua zona, con cui giocare.
//                 </p>
//               </div>

//               <div className="space-y-6">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//                   <Input
//                     placeholder="Cerca per nome, città o tema..."
//                     className="pl-10"
//                   />
//                 </div>

//                 <Button
//                   onClick={onSubmitPublic}
//                   variant="gradient"
//                   className="w-full"
//                 >
//                   Cerca Leghe pubbliche
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }
