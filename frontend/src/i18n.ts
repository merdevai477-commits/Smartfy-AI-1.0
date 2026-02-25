import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    en: {
        translation: {
            nav: {
                features: "Features",
                pricing: "Pricing",
                howItWorks: "How it Works",
                faq: "FAQ",
                login: "Log in",
                signup: "Start Free Trial",
            },
            hero: {
                badge: "The Future of Marketing is Here",
                title: "Supercharge Your Growth with ",
                titleHighlight: "AI Agents",
                subtitle: "Deploy autonomous AI agents that handle your entire marketing workflow—from content creation and social media management to video production and analytics.",
                cta: "Start for Free",
                secondaryCta: "Watch Demo",
                stat1: "Active Users", stat2: "Content Generated", stat3: "Hours Saved",
            },
            logos: { trusted: "Trusted by innovative teams worldwide" },
            howItWorks: {
                title: "How It ", titleHighlight: "Works", subtitle: "Get started in 3 simple steps",
                steps: {
                    1: { title: "Choose Your Service", desc: "Select from content, images, video, or full agent mode" },
                    2: { title: "Configure Your Agent", desc: "Set your brand voice, style, and preferences" },
                    3: { title: "Launch & Scale", desc: "Your AI agent works 24/7, delivering results" },
                }
            },
            services: {
                badge: "Our Services",
                title: "Everything You Need to ",
                titleHighlight: "Dominate Marketing",
                subtitle: "Our AI agents handle every aspect of your marketing strategy with precision and creativity.",
                cards: {
                    content: { title: "AI Content Writing", desc: "Generate blog posts, social media captions, email campaigns, and SEO articles in seconds.", tag: "Content Creation" },
                    image: { title: "AI Image Creation", desc: "Create stunning visuals, product photos, and brand assets instantly.", tag: "Visual Art" },
                    video: { title: "AI Video Production", desc: "Produce engaging marketing videos, reels, and product demos automatically.", tag: "Video & Animation" },
                    marketing: { title: "AI Marketing Agent", desc: "Deploy a full AI agent to plan, execute, and optimize your funnel.", tag: "Strategy & Growth" },
                    social: { title: "Social Media AI", desc: "Automate scheduling, engagement, and growth strategies across platforms.", tag: "Social Automation" },
                    seo: { title: "SEO & Analytics AI", desc: "Optimize your online presence with data-driven SEO and real-time analytics.", tag: "SEO & Data" },
                }
            },
            testimonials: {
                title: "Loved by Marketers ", titleHighlight: "Worldwide",
                reviews: {
                    1: { quote: "Smartfy AI completely transformed our content strategy. We went from publishing 2 articles a week to 20, with better quality than ever.", role: "Head of Marketing" },
                    2: { quote: "The AI image generation alone saved us $5,000/month on design costs. The quality rivals professional designers.", role: "Creative Director" },
                    3: { quote: "Having an AI marketing agent running 24/7 feels like having a full team. Our ROI increased 340% in just 3 months.", role: "CEO" },
                }
            },
            pricing: {
                badge: "Pricing", title: "Simple, ", titleHighlight: "Transparent", titleSuffix: " Pricing",
                subtitle: "Choose the plan that fits your needs.",
                monthly: "Monthly", yearly: "Yearly", save: "Save 20%", ready: "Ready to start?",
                plans: {
                    starter: { name: "Starter", desc: "Perfect for individuals and small projects" },
                    pro: { name: "Professional", desc: "Ideal for growing businesses and teams", badge: "Most Popular" },
                    enterprise: { name: "Enterprise", desc: "For agencies and large-scale operations", badge: "Ultimate" },
                },
                features: {
                    starter: ["50 AI content gen.", "20 image gen.", "Basic chat support", "1 user seat"],
                    pro: ["200 content gen.", "100 image gen.", "Priority support", "5 user seats", "Analytics"],
                    enterprise: ["Unlimited gen.", "Custom models", "24/7 Support", "Unlimited users", "API Access"],
                },
                cta: { start: "Get Started", contact: "Contact Sales" }
            },
            faq: {
                title: "Frequently Asked ", titleHighlight: "Questions",
                items: {
                    1: { q: "What AI models do you use?", a: "We use the latest models including GPT-4o, Claude 3.5, Gemini Pro, DALL-E 3. Our 'Auto' mode selects the best model for each task." },
                    2: { q: "Can I switch between plans?", a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately." },
                    3: { q: "How does the AI Marketing Agent work?", a: "Our AI Marketing Agent autonomously plans, creates, and optimizes your marketing campaigns. It learns your brand voice." },
                    4: { q: "What types of content can the AI create?", a: "Blog posts, social media content, email campaigns, ad copy, product descriptions, images, videos, and much more." },
                    5: { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and never use your data to train our models." },
                    6: { q: "Do you offer a free trial?", a: "Yes! All plans come with a 14-day free trial. No credit card required to start." },
                }
            },
            cta: {
                title: "Ready to Transform Your ", titleHighlight: "Marketing?",
                subtitle: "Join 2,000+ marketers already using AI to scale their business",
                button: "Get Started Free", note: "No credit card required"
            },
            footer: {
                rights: "All rights reserved.",
                description: "Your AI-Powered Marketing Team — 24/7. Transform your marketing with intelligent AI agents.",
                columns: { product: "Product", company: "Company", legal: "Legal" },
                links: {
                    features: "Features", pricing: "Pricing", api: "API", integrations: "Integrations",
                    about: "About", blog: "Blog", careers: "Careers", contact: "Contact",
                    privacy: "Privacy Policy", terms: "Terms of Service", security: "Security"
                }
            },
            onboarding: {
                title: "Welcome! Set up your profile",
                subtitle: "Tell us a bit about you so we can personalize your experience.",
                nameLabel: "Your name",
                namePlaceholder: "Enter your name",
                countryLabel: "Country",
                countryPlaceholder: "Select your country",
                fieldLabel: "Field of interest",
                fieldPlaceholder: "What will you focus on?",
                fields: { clothing: "Clothing & Fashion", watches: "Watches", perfumes: "Perfumes & Beauty", marketing: "Marketing", content_creation: "Content Creation" },
                submit: "Continue",
            },
            profile: {
                title: "Profile",
                name: "Name",
                tone: "Tone",
                tonePlaceholder: "e.g. Professional, Friendly",
                marketingField: "Marketing Field",
                marketingPlaceholder: "e.g. SEO, Content Creation",
                phone: "Phone Number",
                notSpecified: "Not specified",
                accountCreated: "Account Created",
                editInfo: "Edit Information",
                saveChanges: "Save Changes",
                updateSuccess: "Profile updated successfully.",
                updateError: "Failed to update profile. Please try again.",
                logout: "Logout",
                uploadImage: "Change Picture",
                uploadError: "Failed to update profile image. Please try again."
            }
        },
    },
    ar: {
        translation: {
            nav: {
                features: "المميزات",
                pricing: "الأسعار",
                howItWorks: "كيف يعمل",
                faq: "الأسئلة الشائعة",
                login: "تسجيل الدخول",
                signup: "ابدأ التجربة المجانية",
            },
            hero: {
                badge: "مستقبل التسويق يبدأ هنا",
                title: "ضاعف نمو أعمالك مع ", titleHighlight: "وكلاء الذكاء الاصطناعي",
                subtitle: "انشر وكلاء ذكاء اصطناعي مستقلين لإدارة سير عملك التسويقي بالكامل—من إنشاء المحتوى وإدارة وسائل التواصل الاجتماعي إلى الإنتاج.",
                cta: "ابدأ مجاناً", secondaryCta: "شاهد العرض",
                stat1: "مستخدم نشط", stat2: "محتوى مُنشأ", stat3: "ساعة تم توفيرها",
            },
            logos: { trusted: "موثوق من قبل فرق مبتكرة حول العالم" },
            howItWorks: {
                title: "كيف ", titleHighlight: "نعمل", subtitle: "ابدأ في 3 خطوات بسيطة",
                steps: {
                    1: { title: "اختر خدمتك", desc: "اختر من المحتوى، الصور، الفيديو، أو وضع الوكيل الكامل" },
                    2: { title: "قم بتهيئة وكيلك", desc: "حدد صوت علامتك التجارية، الأسلوب، والتفضيلات" },
                    3: { title: "انطلق وتوسع", desc: "وكيل الذكاء الاصطناعي يعمل 24/7 لتحقيق النتائج" },
                }
            },
            services: {
                badge: "خدماتنا", title: "كل ما تحتاجه لـ ", titleHighlight: "السيطرة على السوق",
                subtitle: "وكلاء الذكاء الاصطناعي لدينا يديرون كل جانب من جوانب استراتيجيتك التسويقية بدقة وإبداع.",
                cards: {
                    content: { title: "كتابة المحتوى بالذكاء الاصطناعي", desc: "أنشئ مقالات ومنشورات وحملات بريدية في ثوانٍ.", tag: "إنشاء المحتوى" },
                    image: { title: "توليد الصور بالذكاء الاصطناعي", desc: "صمم صوراً بصرية مذهلة وصور منتجات فورياً.", tag: "فنون بصرية" },
                    video: { title: "إنتاج الفيديو بالذكاء الاصطناعي", desc: "أنتج مقاطع فيديو تسويقية جذابة وريلز تلقائياً.", tag: "فيديو وتحريك" },
                    marketing: { title: "وكيل التسويق الذكي", desc: "انشر وكيلاً ذكياً لتخطيط وتنفيذ حملاتك.", tag: "استراتيجية ونمو" },
                    social: { title: "ذكاء وسائل التواصل", desc: "أتمتة الجدولة والتفاعل عبر جميع المنصات.", tag: "أتمتة اجتماعية" },
                    seo: { title: "SEO والتحليلات", desc: "حسن تواجدك الرقمي مع تحسين محركات البحث والبيانات.", tag: "بيانات و SEO" },
                }
            },
            testimonials: {
                title: "محبوب من المسوقين ", titleHighlight: "حول العالم",
                reviews: {
                    1: { quote: "حول Smartfy AI استراتيجية المحتوى لدينا تماماً. انتقلنا من نشر مقالين أسبوعياً إلى 20 بجودة أفضل.", role: "مدير التسويق" },
                    2: { quote: "توليد الصور وحده وفر علينا 5000 دولار شهرياً من تكاليف التصميم. الجودة تنافس المصممين المحترفين.", role: "مدير إبداعي" },
                    3: { quote: "امتلاك وكيل تسويق ذكي يعمل 24/7 يشبه امتلاك فريق كامل. زاد عائد الاستثمار لدينا بنسبة 340% في 3 أشهر.", role: "المدير التنفيذي" },
                }
            },
            pricing: {
                badge: "الأسعار", title: "أسعار بسيطة و ", titleHighlight: "شفافة", titleSuffix: "",
                subtitle: "اختر الخطة التي تناسب احتياجاتك.",
                monthly: "شهري", yearly: "سنوي", save: "وفر 20%", ready: "جاهز للبدء؟",
                plans: {
                    starter: { name: "البداية", desc: "مثالي للأفراد والمشاريع الصغيرة" },
                    pro: { name: "محترف", desc: "للشركات النامية والفرق", badge: "الأكثر شعبية" },
                    enterprise: { name: "مؤسسات", desc: "للوكالات والعمليات الكبيرة", badge: "الأقوى" },
                },
                features: {
                    starter: ["50 محتوى ذكي", "20 صورة ذكية", "دعم شات أساسي", "مستخدم واحد"],
                    pro: ["200 محتوى", "100 صورة", "دعم أولوية", "5 مستخدمين", "تحليلات"],
                    enterprise: ["محتوى غير محدود", "نماذج مخصصة", "دعم 24/7", "مستخدمين بلا حدود", "API"],
                },
                cta: { start: "اشترك الآن", contact: "تواصل للمبيعات" }
            },
            faq: {
                title: "الأسئلة ", titleHighlight: "الشائعة",
                items: {
                    1: { q: "ما هي نماذج الذكاء الاصطناعي المستخدمة؟", a: "نستخدم أحدث النماذج مثل GPT-4o و Claude 3.5 و Gemini Pro. وضع 'Auto' يختار الأفضل لكل مهمة." },
                    2: { q: "هل يمكنني تغيير خطتي؟", a: "نعم! يمكنك ترقية أو تخفيض خطتك في أي وقت. التغييرات تسري فوراً." },
                    3: { q: "كيف يعمل وكيل التسويق الذكي؟", a: "يقوم الوكيل بتخطيط وإنشاء وتحسين حملاتك التسويقية بشكل مستقل ويتعلم صوت علامتك التجارية." },
                    4: { q: "ما أنواع المحتوى التي يمكن إنشاؤها؟", a: "مقالات، منشورات سوشيال ميديا، إيميلات، إعلانات، صور، فيديوهات، والمزيد." },
                    5: { q: "هل بياناتي آمنة؟", a: "بالتأكيد. نستخدم تشفيراً من مستوى المؤسسات ولا نستخدم بياناتك لتدريب نماذجنا." },
                    6: { q: "هل تقدمون تجربة مجانية؟", a: "نعم! جميع الخطط تأتي مع تجربة مجانية لمدة 14 يوماً." },
                }
            },
            cta: {
                title: "جاهز لتحويل ", titleHighlight: "تسويقك؟",
                subtitle: "انضم إلى أكثر من 2000 مسوق يستخدمون الذكاء الاصطناعي لتنمية أعمالهم",
                button: "ابدأ مجاناً الآن", note: "لا يلزم بطاقة ائتمان"
            },
            footer: {
                rights: "جميع الحقوق محفوظة.",
                description: "فريقك التسويقي المدعوم بالذكاء الاصطناعي — 24/7. حول تسويقك مع وكلاء ذكاء اصطناعي أذكياء.",
                columns: { product: "المنتج", company: "الشركة", legal: "قانوني" },
                links: {
                    features: "المميزات", pricing: "الأسعار", api: "API", integrations: "تكاملات",
                    about: "عن الشركة", blog: "المدونة", careers: "وظائف", contact: "تواصل معنا",
                    privacy: "سياسة الخصوصية", terms: "شروط الخدمة", security: "الأمان"
                }
            },
            onboarding: {
                title: "مرحباً! حدّث ملفك",
                subtitle: "أخبرنا قليلاً عنك لتحسين تجربتك.",
                nameLabel: "اسمك",
                namePlaceholder: "أدخل اسمك",
                countryLabel: "الدولة",
                countryPlaceholder: "اختر دولتك",
                fieldLabel: "المجال المهتم به",
                fieldPlaceholder: "ما المجال الذي ستركز عليه؟",
                fields: { clothing: "ملابس وأزياء", watches: "ساعات", perfumes: "عطور وجمال", marketing: "تسويق", content_creation: "صناعة المحتوى" },
                submit: "متابعة",
            },
            profile: {
                title: "الملف الشخصي",
                name: "الاسم",
                tone: "نبرة الصوت",
                tonePlaceholder: "مثال: احترافي، ودود",
                marketingField: "مجال التسويق",
                marketingPlaceholder: "مثال: SEO، صناعة المحتوى",
                phone: "رقم الجوال",
                notSpecified: "لم يُحدد",
                accountCreated: "تاريخ الانضمام",
                editInfo: "تعديل المعلومات",
                saveChanges: "حفظ التغييرات",
                updateSuccess: "تم تحديث الملف الشخصي بنجاح.",
                updateError: "حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.",
                logout: "خروج",
                uploadImage: "تغيير الصورة",
                uploadError: "حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى."
            }
        },
    },
    fr: {
        translation: {
            nav: {
                features: "Fonctionnalités",
                pricing: "Tarification",
                howItWorks: "Comment ça marche",
                faq: "FAQ",
                login: "Connexion",
                signup: "Essai Gratuit",
            },
            hero: {
                badge: "L'avenir du marketing est ici",
                title: "Boostez votre croissance avec ", titleHighlight: "les Agents IA",
                subtitle: "Déployez des agents IA autonomes pour gérer l'ensemble de votre flux marketing.",
                cta: "Essai gratuit", secondaryCta: "Voir la démo",
                stat1: "Utilisateurs Actifs", stat2: "Contenus Générés", stat3: "Heures Économisées",
            },
            logos: { trusted: "Reconnu par des équipes innovantes dans le monde" },
            howItWorks: {
                title: "Comment ça ", titleHighlight: "Marche", subtitle: "Commencez en 3 étapes simples",
                steps: {
                    1: { title: "Choisissez votre service", desc: "Contenu, images, vidéo ou mode agent complet" },
                    2: { title: "Configurez votre agent", desc: "Définissez votre voix de marque et style" },
                    3: { title: "Lancez et évoluez", desc: "Votre agent IA travaille 24/7 pour des résultats" },
                }
            },
            services: {
                badge: "Nos Services", title: "Tout pour ", titleHighlight: "Dominer le Marché",
                subtitle: "Nos agents IA gèrent chaque aspect de votre stratégie marketing avec précision.",
                cards: {
                    content: { title: "Rédaction IA", desc: "Articles, posts et e-mails en quelques secondes.", tag: "Contenu" },
                    image: { title: "Création d'Images IA", desc: "Visuels marketing époustouflants instantanément.", tag: "Art Visuel" },
                    video: { title: "Production Vidéo IA", desc: "Vidéos marketing engageantes automatiquement.", tag: "Vidéo" },
                    marketing: { title: "Agent Marketing IA", desc: "Agent complet pour planifier et optimiser votre funnel.", tag: "Stratégie" },
                    social: { title: "IA Réseaux Sociaux", desc: "Automatisation et engagement.", tag: "Social" },
                    seo: { title: "SEO & Analytique", desc: "Optimisation avec données en temps réel.", tag: "SEO" },
                }
            },
            testimonials: {
                title: "Aimé par les marketeurs ", titleHighlight: "Mondiaux",
                reviews: {
                    1: { quote: "Smartfy AI a transformé notre stratégie. De 2 articles par semaine à 20, avec une meilleure qualité.", role: "Chef Marketing" },
                    2: { quote: "La génération d'images nous a économisé 5000$/mois. Qualité pro.", role: "Directeur Créatif" },
                    3: { quote: "Un agent marketing 24/7, c'est comme une équipe complète. ROI +340% en 3 mois.", role: "PDG" },
                }
            },
            pricing: {
                badge: "Tarifs", title: "Tarifs Simples et ", titleHighlight: "Transparents", titleSuffix: "",
                subtitle: "Choisissez le plan adapté à vos besoins.",
                monthly: "Mensuel", yearly: "Annuel", save: "-20%", ready: "Prêt à commencer ?",
                plans: {
                    starter: { name: "Débutant", desc: "Pour les individus" },
                    pro: { name: "Professionnel", desc: "Pour les équipes en croissance", badge: "Populaire" },
                    enterprise: { name: "Entreprise", desc: "Pour les grandes opérations", badge: "Ultime" },
                },
                features: {
                    starter: ["50 contenus IA", "20 images IA", "Support de chat", "1 utilisateur"],
                    pro: ["200 contenus", "100 images", "Support prioritaire", "5 utilisateurs", "Analytique"],
                    enterprise: ["Illimité", "Modèles personnalisés", "Support 24/7", "Utilisateurs illimités", "API"],
                },
                cta: { start: "Commencer", contact: "Contacter Ventes" }
            },
            faq: {
                title: "Questions ", titleHighlight: "Fréquentes",
                items: {
                    1: { q: "Quels modèles IA utilisez-vous ?", a: "GPT-4o, Claude 3.5, Gemini Pro, DALL-E 3. Le mode 'Auto' choisit le meilleur." },
                    2: { q: "Puis-je changer de plan ?", a: "Oui, à tout moment. Les changements sont immédiats." },
                    3: { q: "Comment fonctionne l'Agent Marketing ?", a: "Il planifie, crée et optimise vos campagnes de manière autonome." },
                    4: { q: "Quel type de contenu ?", a: "Blogs, réseaux sociaux, e-mails, publicités, images, vidéos, etc." },
                    5: { q: "Mes données sont-elles sécurisées ?", a: "Oui, cryptage d'entreprise. Nous n'utilisons pas vos données pour l'entraînement." },
                    6: { q: "Essai gratuit ?", a: "Oui, 14 jours gratuits sur tous les plans." },
                }
            },
            cta: {
                title: "Prêt à transformer votre ", titleHighlight: "Marketing ?",
                subtitle: "Rejoignez +2000 marketeurs qui utilisent l'IA.",
                button: "Commencer gratuitement", note: "Pas de carte requise"
            },
            footer: {
                rights: "Tous droits réservés.",
                description: "Votre équipe marketing IA — 24/7. Transformez votre marketing avec des agents intelligents.",
                columns: { product: "Produit", company: "Société", legal: "Légal" },
                links: {
                    features: "Fonctionnalités", pricing: "Tarifs", api: "API", integrations: "Intégrations",
                    about: "À propos", blog: "Blog", careers: "Carrières", contact: "Contact",
                    privacy: "Confidentialité", terms: "Conditions", security: "Sécurité"
                }
            },
            onboarding: {
                title: "Bienvenue ! Configurez votre profil",
                subtitle: "Parlez-nous un peu de vous pour personnaliser votre expérience.",
                nameLabel: "Votre nom",
                namePlaceholder: "Entrez votre nom",
                countryLabel: "Pays",
                countryPlaceholder: "Sélectionnez votre pays",
                fieldLabel: "Domaine d'intérêt",
                fieldPlaceholder: "Sur quoi allez-vous vous concentrer ?",
                fields: { clothing: "Vêtements et mode", watches: "Montres", perfumes: "Parfums et beauté", marketing: "Marketing", content_creation: "Création de contenu" },
                submit: "Continuer",
            },
            profile: {
                title: "Profil",
                name: "Nom",
                tone: "Ton",
                tonePlaceholder: "ex: Professionnel, Amical",
                marketingField: "Domaine Marketing",
                marketingPlaceholder: "ex: SEO, Création de contenu",
                phone: "Numéro de téléphone",
                notSpecified: "Non spécifié",
                accountCreated: "Compte Créé le",
                editInfo: "Modifier les infos",
                saveChanges: "Sauvegarder les modifications",
                updateSuccess: "Profil mis à jour avec succès.",
                updateError: "Échec de la mise à jour du profil.",
                logout: "Déconnexion",
                uploadImage: "Changer la photo",
                uploadError: "Échec de la modification de la photo."
            }
        },
    },
    es: {
        translation: {
            nav: {
                features: "Características",
                pricing: "Precios",
                howItWorks: "Cómo funciona",
                faq: "FAQ",
                login: "Iniciar sesión",
                signup: "Prueba Gratis",
            },
            hero: {
                badge: "El futuro del marketing está aquí",
                title: "Potencia tu crecimiento con ", titleHighlight: "Agentes de IA",
                subtitle: "Despliegue agentes de IA autónomos que manejen todo su flujo de trabajo de marketing.",
                cta: "Empieza Gratis", secondaryCta: "Ver Demo",
                stat1: "Usuarios Activos", stat2: "Contenido Generado", stat3: "Horas Ahorradas",
            },
            logos: { trusted: "Confiado por equipos innovadores en todo el mundo" },
            howItWorks: {
                title: "Cómo ", titleHighlight: "Funciona", subtitle: "Empiece en 3 pasos simples",
                steps: {
                    1: { title: "Elija su servicio", desc: "Contenido, imágenes, video o modo agente completo" },
                    2: { title: "Configure su agente", desc: "Defina la voz y estilo de su marca" },
                    3: { title: "Lance y escale", desc: "Su agente de IA trabaja 24/7 para resultados" },
                }
            },
            services: {
                badge: "Nuestros Servicios", title: "Todo para ", titleHighlight: "Dominar el Mercado",
                subtitle: "Nuestros agentes de IA manejan cada aspecto de su estrategia.",
                cards: {
                    content: { title: "Redacción IA", desc: "Blogs, posts y correos en segundos.", tag: "Contenido" },
                    image: { title: "Creación de Imágenes IA", desc: "Visuales impresionantes al instante.", tag: "Arte Visual" },
                    video: { title: "Producción de Video IA", desc: "Videos de marketing atractivos.", tag: "Video" },
                    marketing: { title: "Agente de Marketing IA", desc: "Agente completo para planificar su embudo.", tag: "Estrategia" },
                    social: { title: "IA Redes Sociales", desc: "Automatización y compromiso.", tag: "Social" },
                    seo: { title: "SEO y Analítica", desc: "Optimización con datos en tiempo real.", tag: "SEO" },
                }
            },
            testimonials: {
                title: "Amado por Marketers ", titleHighlight: "Mundiales",
                reviews: {
                    1: { quote: "Smartfy AI transformó nuestra estrategia. De 2 artículos a 20, con mejor calidad.", role: "Jefe de Marketing" },
                    2: { quote: "La generación de imágenes nos ahorró $5,000/mes. Calidad profesional.", role: "Director Creativo" },
                    3: { quote: "Un agente 24/7 es como un equipo completo. ROI +340% en 3 meses.", role: "CEO" },
                }
            },
            pricing: {
                badge: "Precios", title: "Precios Simples y ", titleHighlight: "Transparentes", titleSuffix: "",
                subtitle: "Elija el plan que se adapte a sus necesidades.",
                monthly: "Mensual", yearly: "Anual", save: "-20%", ready: "¿Listo para empezar?",
                plans: {
                    starter: { name: "Inicial", desc: "Para individuos" },
                    pro: { name: "Profesional", desc: "Para equipos en crecimiento", badge: "Popular" },
                    enterprise: { name: "Empresarial", desc: "Para grandes operaciones", badge: "Ultimo" },
                },
                features: {
                    starter: ["50 contenidos IA", "20 imágenes IA", "Soporte básico", "1 usuario"],
                    pro: ["200 contenidos", "100 imágenes", "Soporte prioritario", "5 usuarios", "Analítica"],
                    enterprise: ["Ilimitado", "Modelos personalizados", "Soporte 24/7", "Usuarios ilimitados", "API"],
                },
                cta: { start: "Empezar", contact: "Contactar Ventas" }
            },
            faq: {
                title: "Preguntas ", titleHighlight: "Frecuentes",
                items: {
                    1: { q: "¿Qué modelos de IA usan?", a: "GPT-4o, Claude 3.5, Gemini Pro. El modo 'Auto' elige el mejor." },
                    2: { q: "¿Puedo cambiar de plan?", a: "¡Sí! En cualquier momento." },
                    3: { q: "¿Cómo funciona el Agente?", a: "Planifica, crea y optimiza sus campañas de forma autónoma." },
                    4: { q: "¿Qué contenido puede crear?", a: "Blogs, redes sociales, correos, anuncios, imágenes, videos, etc." },
                    5: { q: "¿Son seguros mis datos?", a: "Sí, encriptación empresarial. No entrenamos modelos con sus datos." },
                    6: { q: "¿Hay prueba gratis?", a: "¡Sí! 14 días gratis en todos los planes." },
                }
            },
            cta: {
                title: "¿Listo para transformar su ", titleHighlight: "Marketing?",
                subtitle: "Únase a +2000 marketers que usan IA.",
                button: "Empezar Gratis", note: "Sin tarjeta de crédito"
            },
            footer: {
                rights: "Todos los derechos reservados.",
                description: "Su equipo de marketing de IA — 24/7. Transforme su marketing con agentes inteligentes.",
                columns: { product: "Producto", company: "Compañía", legal: "Legal" },
                links: {
                    features: "Características", pricing: "Precios", api: "API", integrations: "Integraciones",
                    about: "Nosotros", blog: "Blog", careers: "Carreras", contact: "Contacto",
                    privacy: "Privacidad", terms: "Términos", security: "Seguridad"
                }
            },
            onboarding: {
                title: "¡Bienvenido! Configura tu perfil",
                subtitle: "Cuéntanos un poco de ti para personalizar tu experiencia.",
                nameLabel: "Tu nombre",
                namePlaceholder: "Introduce tu nombre",
                countryLabel: "País",
                countryPlaceholder: "Selecciona tu país",
                fieldLabel: "Campo de interés",
                fieldPlaceholder: "¿En qué te enfocarás?",
                fields: { clothing: "Ropa y moda", watches: "Relojes", perfumes: "Perfumes y belleza", marketing: "Marketing", content_creation: "Creación de contenido" },
                submit: "Continuar",
            },
            profile: {
                title: "Perfil",
                name: "Nombre",
                tone: "Tono",
                tonePlaceholder: "ej: Profesional, Amigable",
                marketingField: "Campo de Marketing",
                marketingPlaceholder: "ej: SEO, Creación de contenido",
                phone: "Teléfono",
                notSpecified: "No especificado",
                accountCreated: "Cuenta Creada",
                editInfo: "Editar Información",
                saveChanges: "Guardar Cambios",
                updateSuccess: "Perfil actualizado con éxito.",
                updateError: "Error al actualizar el perfil.",
                logout: "Cerrar sesión",
                uploadImage: "Cambiar foto",
                uploadError: "Error al actualizar la foto de perfil."
            }
        },
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: { escapeValue: false },
        detection: { order: ['queryString', 'cookie'], caches: ['cookie'] }
    });

export default i18n;
