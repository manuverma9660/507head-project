import { createPublicClient } from "./supabase/public";
import { parseRichText, type RichTextDocument } from "./rich-text";
import { cacheLife, cacheTag } from "next/cache";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  bio: string;
  avatar_url?: string | null;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  rich_body?: RichTextDocument | null;
  category_slug: string;
  category_name: string;
  author: Author;
  featured_image_url: string;
  featured_image_alt: string;
  featured_image_caption?: string;
  featured_image_credit?: string;
  is_featured: boolean;
  published_at: string;
  updated_at?: string;
  reading_time_minutes: number;
  tags: string[];
}

export const APPROVED_CATEGORIES: Category[] = [
  {
    id: "cat-history",
    slug: "history",
    name: "इतिहास और विरासत",
    description:
      "507 हेड, बीकानेर और थार मरुस्थल की ऐतिहासिक धरोहर, पुराने रास्ते और जनजीवन।",
    sort_order: 1,
  },
  {
    id: "cat-farming",
    slug: "farming",
    name: "खेती-बाड़ी",
    description:
      "परंपरागत मरुस्थलीय खेती, नहरी सिंचाई, आधुनिक तकनीकें और उन्नत फसलें।",
    sort_order: 2,
  },
  {
    id: "cat-kisan",
    slug: "kisan",
    name: "किसान",
    description:
      "गाँव और देश की रीढ़, किसानों का परिश्रम, अनुभव और संघर्ष की सच्ची कहानियाँ।",
    sort_order: 3,
  },
  {
    id: "cat-wisdom",
    slug: "wisdom",
    name: "बुजुर्गों की सीख",
    description:
      "पीढ़ियों के गहरे अनुभव, लोक सूक्तियां और जीवन की व्यावहारिक समझ।",
    sort_order: 4,
  },
  {
    id: "cat-heritage",
    slug: "heritage",
    name: "सांस्कृतिक विरासत",
    description:
      "राजस्थानी लोक संस्कृति, पारंपरिक रीति-रिवाज, लोकगीत और स्थानीय कला।",
    sort_order: 5,
  },
  {
    id: "cat-pashupalan",
    slug: "pashupalan",
    name: "पशुपालन",
    description:
      "राठी गाय, ऊँट, डेयरी व्यवसाय और मरुस्थल में पशुधन संरक्षण की जानकारी।",
    sort_order: 6,
  },
  {
    id: "cat-food",
    slug: "food",
    name: "खान-पान",
    description:
      "पारंपरिक मरुस्थलीय व्यंजन, बाजरे की रोटी, कैर-सांगरी और पौष्टिक स्वाद।",
    sort_order: 7,
  },
];

/**
 * Only the handbook's seven approved categories are ever returned publicly.
 */
export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  try {
    const supabase = createPublicClient();
    if (!supabase) return APPROVED_CATEGORIES;

    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name, description, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return APPROVED_CATEGORIES;

    return data.map((category) => ({
      id: String(category.id),
      slug: category.slug,
      name: category.name,
      description: category.description || "",
      sort_order: category.sort_order,
    }));
  } catch (error) {
    console.error("Error fetching categories from Supabase:", error);
    return APPROVED_CATEGORIES;
  }
}

export const DEFAULT_AUTHOR: Author = {
  id: "author-default",
  slug: "507-head-team",
  name: "507 Head संपादकीय टीम",
  bio: "507 हेड और पश्चिमी राजस्थान के ग्रामीण जीवन, जल, संस्कृति और खेती की सच्ची रिपोर्टिंग।",
  avatar_url:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "thar-registan-507-head-itihas",
    title: "रेत के धोरों के बीच 507 हेड: इतिहास, नहरी क्रांति और बदलता परिवेश",
    excerpt:
      "बीकानेर के छतरगढ़ क्षेत्र में 507 हेड केवल एक जल वितरण केंद्र नहीं, बल्कि मरुभूमि में जीवन और हरियाली की नई गाथा है।",
    category_slug: "history",
    category_name: "इतिहास और विरासत",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://images.bhaskarassets.com/web2images/521/2025/08/11/orig_4-1-1-1-1-1-1-1-1-1-1-1_1754872440.jpg",
    featured_image_alt: "थार मरुस्थल के रेतीले धोरे और सूर्यास्त का दृश्य",
    featured_image_caption: "507 हेड के आसपास फैले थार के विशाल धोरे",
    is_featured: true,
    published_at: "2026-10-20T09:00:00.000Z",
    reading_time_minutes: 5,
    tags: ["507 हेड", "इतिहास", "थार मरुस्थल", "इंदिरा गांधी नहर", "बीकानेर"],
    body: [
      "राजस्थान के बीकानेर जिले की छतरगढ़ तहसील में स्थित 507 हेड इंदिरा गांधी नहर परियोजना (IGNP) के इतिहास में एक महत्वपूर्ण मील का पत्थर माना जाता है। कभी मीलों दूर तक फैले बंजर रेतीले धोरों के बीच जब नहरी पानी पहुँचा, तो यहाँ के जनजीवन और भूगोल ने एक नया मोड़ लिया।",
      "पुराने समय में यहाँ पानी की बूँद-बूँद के लिए मीलों चलना पड़ता था। बारिश के मौसम में टोबा और कुंडों में पानी सहेजना ही जीने का एकमात्र सहारा था। 507 हेड जलाशय और वितरिकाओं के निर्माण ने पूरे इलाके में खेती, पशुपालन और बस्तियों के विकास को गति दी।",
      "स्थानीय बुजुर्ग बताते हैं कि नहर आने से पहले यहाँ तेज गर्म हवाएं (लू) और बवंडर रोज की बात हुआ करते थे। आज इस क्षेत्र में किन्नू, गेहूँ और सरसों के लहलहाते खेत देखकर कोई भी इस बात का अंदाजा नहीं लगा सकता कि यह वही सूखा मरुस्थल है।",
      "507 हेड की यह ऐतिहासिक यात्रा संघर्ष, धैर्य और इंसानी हौसले की वो मिसाल है, जिसे आने वाली पीढ़ियों तक सहेज कर पहुँचाना हमारा पहला कर्तव्य है।",
    ],
  },
  {
    id: "art-2",
    slug: "nahari-kshetra-kheti-unnat-tarike",
    title:
      "नहरी क्षेत्र में खेती: कम पानी में अधिक उपज के पारंपरिक व आधुनिक गुर",
    excerpt:
      "नहरबंदी और सीमित जल उपलब्धता के बीच किसान कैसे मिट्टी की नमी सहेजकर बंपर पैदावार ले रहे हैं, जानिए इस रिपोर्ट में।",
    category_slug: "farming",
    category_name: "खेती-बाड़ी",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi5OaYV-_JlxDzp2JKqU7NJ9a4AXX-bggjKNeBXp1ZTg&s=10",
    featured_image_alt: "लहलहाते खेत और सुबह की ताजी धूप",
    featured_image_caption: "नहरी पानी से सींचे गए 507 हेड क्षेत्र के खेत",
    is_featured: false,
    published_at: "2026-10-19T10:30:00.000Z",
    reading_time_minutes: 4,
    tags: ["खेती", "सिंचाई", "फसल प्रबंधन", "नहरी पानी", "किसान"],
    body: [
      "पश्चिमी राजस्थान के नहरी क्षेत्रों में खेती केवल मिट्टी और बीज का खेल नहीं, बल्कि समय प्रबंधन और जल संरक्षण का विज्ञान है। 507 हेड क्षेत्र में जब नहरी पानी की बारी आती है, तो किसान दिन-रात एक कर देते हैं।",
      "हाल के वर्षों में ड्रिप इरीगेशन (फव्वारा व बूँद-बूँद सिंचाई) और लेजर लैंड लेवलिंग तकनीकों ने किसानों की दिशा बदली है। पारंपरिक धोरा सिंचाई की जगह अब पक्के खाळे और पाइपलाइनों का उपयोग बढ़ रहा है, जिससे पानी का रिसाव 40 प्रतिशत तक कम हुआ है।",
      "कृषि विशेषज्ञों का मानना है कि नहरी रेतीली मिट्टी में जैविक खाद और हरी खाद (ढैंचा) का प्रयोग मिट्टी की जल धारण क्षमता को दोगुना कर देता है।",
      "किसानों का कहना है कि सही समय पर बुवाई और जैविक तौर-तरीकों को अपनाकर न केवल लागत कम होती है, बल्कि फसल का स्वाद और बाजार भाव भी बेहतर मिलता है।",
    ],
  },
  {
    id: "art-3",
    slug: "rathi-gaay-marusthal-ki-kamdhenu",
    title: "राठी गाय: थार मरुस्थल की कामधेनु और पशुपालकों की सच्ची पूंजी",
    excerpt:
      "कम चारे और भीषण गर्मी में भी भरपूर दूध देने वाली राठी नस्ल आज पूरे देश के पशुपालकों की पहली पसंद बन रही है।",
    category_slug: "pashupalan",
    category_name: "पशुपालन",
    author: DEFAULT_AUTHOR,
    featured_image_url: "https://img-cdn.krishijagran.com/68043/ty.jpeg",
    featured_image_alt: "मरुस्थलीय परिवेश में राठी गाय और उसका बछड़ा",
    featured_image_caption: "बीकानेर और 507 हेड इलाके की प्रसिद्ध राठी नस्ल",
    is_featured: false,
    published_at: "2026-10-18T14:15:00.000Z",
    reading_time_minutes: 4,
    tags: ["राठी गाय", "पशुपालन", "डेयरी", "देशी गोवंश", "दूध"],
    body: [
      "थार रेगिस्तान में सदियों से पशुपालन ही आजीविका का मुख्य आधार रहा है। यहाँ की स्थानीय जलवायु में पनपी 'राठी गाय' को मरुस्थल की कामधेनु कहा जाता है। यह गाय भीषण 48 डिग्री तापमान और कड़ाके की ठंड दोनों को आसानी से सहन कर लेती है।",
      "राठी गाय की त्वचा पर मौजूद खास पसीने की ग्रंथियां इसे अत्यधिक गर्मी से बचाती हैं। साथ ही स्थानीय सूखी घास, सेवण, धामण और सांगरी के पत्तों को खाकर भी यह प्रतिदिन 12 से 18 लीटर तक पौष्टिक और ए-2 गुणवत्ता वाला दूध देती है।",
      "507 हेड और आसपास के गाँवों में कई पशुपालक आज शुद्ध नस्ल के संवर्धन से अपनी आमदनी को कई गुना बढ़ा रहे हैं। डेयरी उद्योग के साथ-साथ शुद्ध देशी घी की माँग शहरों में तेजी से बढ़ी है।",
      "गोपालकों का कहना है कि अगर पशुओं के टीकाकरण और नियमित स्वच्छ पानी की व्यवस्था रखी जाए, तो राठी पालन किसी भी सरकारी नौकरी से अधिक सम्मानजनक और मुनाफे का काम है।",
    ],
  },
  {
    id: "art-4",
    slug: "bujurgon-ke-tajurbe-aur-paramparik-seekh",
    title: "बुजुर्गों की सीख: मौसम, मिट्टी और जिंदगी को परखने का अनमोल ज्ञान",
    excerpt:
      "जब मौसम विभाग नहीं था, तब ग्रामीण बुजुर्ग बादलों की चाल, हवा के रुख और पक्षियों की बोली से पूरे साल का हाल बता देते थे।",
    category_slug: "wisdom",
    category_name: "बुजुर्गों की सीख",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7tsXyf-KOkWlFBzQTjJF-MK7S1p3MclAEMeOpgNJPPb_rMosdeOSRaH4R&s=10",
    featured_image_alt: "गाँव की चौपाल पर बैठे बुजुर्ग और पारंपरिक पगड़ी",
    featured_image_caption: "गाँव की चौपाल में जीवन के अनुभव साझा करते बुजुर्ग",
    is_featured: false,
    published_at: "2026-10-17T08:00:00.000Z",
    reading_time_minutes: 3,
    tags: ["बुजुर्ग", "संस्कृति", "चौपाल", "अनुभव", "जीवन दर्शन"],
    body: [
      "गाँव की चौपाल केवल बैठने की जगह नहीं, बल्कि अनौपचारिक विश्वविद्यालय है जहाँ सदियों से परखा हुआ ज्ञान नई पीढ़ी को बिना किसी किताब के मिलता आया है।",
      "गाँव के बड़े-बुजुर्ग कहते हैं—'रोटी तवे पर और बात चौपाल पर ही पकती है।' थार के बुजुर्ग आज भी जेठ की हवा का रुख देखकर बता देते हैं कि सावन में बादल बरसेंगे या नहीं। तितरपंखी बादलों और चींटियों के अंडे लेकर चलने से बारिश का अनुमान लगाना उनकी रोजमर्रा की समझ का हिस्सा रहा है।",
      "बुजुर्गों की यह सीख केवल मौसम तक सीमित नहीं है। परिवार में धैर्य, पड़ोसी का सुख-दुख में साथ और संकट के समय संयम रखने के जो संस्कार बुजुर्ग देते हैं, वे आज के आधुनिक दौर में सबसे अधिक प्रासंगिक हैं।",
      "हमारी जिम्मेदारी है कि हम चौपाल की इन आवाजों को इंटरनेट के शोर में खोने न दें, बल्कि इन्हें संजोकर अगली पीढ़ी तक पहुँचाएं।",
    ],
  },
  {
    id: "art-5",
    slug: "bajra-roti-sangri-marusthal-poshan",
    title:
      "बाजरे का सोगरा और कैर-सांगरी: थार के पारम्परिक स्वाद में छुपा सेहत का राज",
    excerpt:
      "मिट्टी के चूल्हे पर सिका कड़क सोगरा, शुद्ध मक्खन और सूखी सांगरी की सब्जी—यह केवल खाना नहीं, मरुभूमि का अमृत है।",
    category_slug: "food",
    category_name: "खान-पान",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoAhYxoVz_zQeD-Ki_4T6gpbFKYqf4y9P11rJgGY23dB2kVAOvApsnqHwO&s=10",
    featured_image_alt: "पारंपरिक राजस्थानी थाली और बाजरे की रोटी",
    featured_image_caption: "पौष्टिकता से भरपूर पारंपरिक मरुस्थलीय खान-पान",
    is_featured: false,
    published_at: "2026-10-16T12:00:00.000Z",
    reading_time_minutes: 4,
    tags: ["खान-पान", "बाजरा", "कैर सांगरी", "राजस्थानी स्वाद", "स्वास्थ्य"],
    body: [
      "राजस्थान का खान-पान यहाँ की जलवायु और प्राकृतिक संसाधनों की देन है। पश्चिमी राजस्थान में सदियों से बाजरा मुख्य अनाज रहा है। सर्दियों में बाजरे का मोटा सोगरा और गर्म राबड़ी शरीर को ऊर्जा और गर्माहट देती है।",
      "खेजड़ी के वृक्ष पर लगने वाली सांगरी और कैर की झाड़ी से चुने गए छोटे फल बिना किसी रासायनिक खाद के प्राकृतिक रूप से तैयार होते हैं। इन्हें सुखाकर साल भर रखा जाता है और दही व मसालों के साथ पकाया जाता है।",
      "आधुनिक पोषण विज्ञान भी मानता है कि बाजरे में भरपूर फाइबर, आयरन और मैग्नीशियम होता है, जो मधुमेह और हृदय रोगों से बचाव में सहायक है।",
      "507 हेड के गाँवों में आज भी मेहमानों का स्वागत मतीरे की सब्जी, काचरी की चटनी और ताजी छाछ से किया जाता है, जिसका स्वाद पाँच सितारा होटलों के खाने पर भी भारी पड़ता है।",
    ],
  },
  {
    id: "art-6",
    slug: "thar-sanskriti-lokgeet-parampara",
    title: "धोरों में गूँजती मांड और लोकगीत: थार की समृद्ध सांस्कृतिक पहचान",
    excerpt:
      "अलगोजा, कमायचा और खड़ताल की धुन पर जब रेगिस्तान में शाम ढलती है, तो सदियों पुरानी दास्तानें जीवंत हो उठती हैं।",
    category_slug: "heritage",
    category_name: "सांस्कृतिक विरासत",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Rajasthan_Folk_Music.jpg/3840px-Rajasthan_Folk_Music.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
    featured_image_alt: "राजस्थानी लोक कलाकार और पारंपरिक संगीत वाद्ययंत्र",
    featured_image_caption: "थार की सांस्कृतिक विरासत को संजोते स्थानीय कलाकार",
    is_featured: false,
    published_at: "2026-10-15T15:45:00.000Z",
    reading_time_minutes: 4,
    tags: ["विरासत", "लोक संगीत", "संस्कृति", "थार", "परंपरा"],
    body: [
      "राजस्थान की पहचान उसकी मिट्टी के गीतों और लोक गाथाओं से है। थार के रेगिस्तान में कठिन जीवन के बावजूद लोगों के दिलों में संगीत और उमंग कभी कम नहीं हुई।",
      "यहाँ के लोकगीतों में कभी विरह की पीड़ा है, तो कभी बादलों के आने की खुशी। तेजाजी के भजन, पाबूजी की पड़ और मीरां के पद ग्रामीण जनजीवन की नस-नस में रचे-बसे हैं।",
      "स्थानीय मांगणियार और लंगा कलाकारों ने पीढ़ियों से इस परंपरा को बिना किसी औपचारिक विद्यालय के जीवित रखा है। उनकी उंगलियाँ जब कमायचे के तारों को छूती हैं, तो रेगिस्तान की रेत भी झूमने लगती है।",
      "507 हेड की युवा पीढ़ी आज इन सांस्कृतिक जड़ों से जुड़कर डिजिटल माध्यमों के जरिए अपनी पहचान को दुनिया भर में पहुँचाने का प्रयास कर रही है।",
    ],
  },
  {
    id: "art-7",
    slug: "kisan-mehanat-anubhav-desh-ki-shaan",
    title:
      "रेगिस्तान के जांबाज किसान: रेत को सोना बनाने वाले अन्नदाताओं की दास्तान",
    excerpt:
      "कड़ाके की धूप और ठंडी रातों में नहर के पानी का पहरा देने वाले 507 हेड के किसानों का त्याग और समर्पण।",
    category_slug: "kisan",
    category_name: "किसान",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://sc0.blr1.cdn.digitaloceanspaces.com/article/196544-fiimlmpoxr-1702239573.jpg",
    featured_image_alt: "खेत में काम करता हुआ राजस्थानी किसान",
    featured_image_caption: "507 हेड के कर्मठ किसान की मेहनत का एक दृश्य",
    is_featured: false,
    published_at: "2026-10-14T11:20:00.000Z",
    reading_time_minutes: 4,
    tags: ["किसान", "अन्नदाता", "मेहनत", "नहरी पानी", "गाँव"],
    body: [
      "शहरों में जब लोग सुकून की नींद सो रहे होते हैं, तब 507 हेड के किसान कड़कड़ाती ठंड में टॉर्च की रोशनी में नहरी नाकों पर खड़े पानी का पहरा दे रहे होते हैं।",
      "एक-एक बूंद पानी का सही हिसाब रखना, रेतीले धोरों को समतल कर मेड़बंदी करना और तेज आँधियों में भी फसलों की रक्षा करना किसी तपस्या से कम नहीं है।",
      "गाँव के किसानों का कहना है कि खेती सिर्फ एक धंधा नहीं, बल्कि मिट्टी से किया गया पवित्र वादा है। फसल अच्छी हो या खराब, किसान कभी उम्मीद का दामन नहीं छोड़ता।",
      "507 Head का उद्देश्य इन्हीं अनसुने अन्नदाताओं की मेहनत, उनके अधिकारों और उनकी वास्तविक आवाज को मुख्यधारा तक पहुँचाना है।",
    ],
  },
  {
    id: "art-8",
    slug: "kinnu-anaar-kheti-bikaner-munafa",
    title: "बीकानेर क्षेत्र में किन्नू और अनार के बगीचे: बंपर मुनाफे की नई राह",
    excerpt:
      "रेतीली जमीन पर बागवानी क्रांति: 507 हेड के किसान ड्रिप सिस्टम से मीठे किन्नू उगाकर लाखों कमा रहे हैं।",
    category_slug: "farming",
    category_name: "खेती-बाड़ी",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://media.istockphoto.com/id/1050650472/photo/ripe-pomegranate-fruits-on-the-branches-of-trees-in-the-garden-rows-of-pomegranate-trees-with.jpg?s=612x612&w=0&k=20&c=C_GX-u9pCaznrSdl2SGVAtVul8N5kFglGKyRy12ThbM=",
    featured_image_alt: "किन्नू और फलों का हरा-भरा बगीचा",
    featured_image_caption: "नहरी क्षेत्र में बागवानी का सफल मॉडल",
    is_featured: false,
    published_at: "2026-10-13T09:15:00.000Z",
    reading_time_minutes: 4,
    tags: ["किन्नू", "बागवानी", "खेती", "मुनाफा", "किसान"],
    body: [
      "पारंपरिक गेहूँ और सरसों के साथ-साथ अब 507 हेड और छतरगढ़ क्षेत्र में किन्नू, मौसमी और अनार के बाग तेजी से बढ़ रहे हैं। रेतीली मिट्टी में सूर्य का भरपूर प्रकाश फलों में मिठास बढ़ाने का काम करता है।",
      "ड्रिप इरीगेशन से पौधों की जड़ों तक सीमित पानी पहुँचाकर पानी की 70% बचत होती है। साथ ही फल का आकार और रंग भी बाजार की माँग के अनुरूप होता है।",
      "प्रगतिशील किसानों का अनुभव बताता है कि तीसरे वर्ष से फल लगना शुरू हो जाता है और पारंपरिक फसलों की तुलना में प्रति बीघा आमदनी दोगुनी से अधिक हो जाती है।",
    ],
  },
  {
    id: "art-9",
    slug: "untni-ka-doodh-marusthal-dairy",
    title: "ऊँटनी का दूध और मरुस्थलीय डेयरी: स्वास्थ्य और आमदनी का नया केंद्र",
    excerpt:
      "औषधीय गुणों से भरपूर ऊँटनी के दूध की माँग देश-विदेश में बढ़ी, थार के पशुपालकों को मिल रहा नया बाजार।",
    category_slug: "pashupalan",
    category_name: "पशुपालन",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxNh_R6xE4OQOOs7ty00IOmVb0YUMOh_NhST3yLBf-jA&s=10",
    featured_image_alt: "रेगिस्तान में ऊँटों का झुंड",
    featured_image_caption: "थार का जहाज: ऊँट संरक्षण और दुग्ध उत्पादन",
    is_featured: false,
    published_at: "2026-10-12T14:30:00.000Z",
    reading_time_minutes: 4,
    tags: ["ऊँट", "पशुपालन", "डेयरी", "स्वास्थ्य", "थार"],
    body: [
      "राजस्थान के राज्य पशु ऊँट को बचाने और पालकों की आय बढ़ाने में कैमल मिल्क (ऊँटनी का दूध) मील का पत्थर साबित हो रहा है। इसमें इन्सुलिन की प्रचुर मात्रा होने के कारण यह मधुमेह रोगियों के लिए अत्यंत लाभकारी माना जाता है।",
      "बीकानेर स्थित राष्ट्रीय उष्ट्र अनुसंधान केंद्र (NRCC) के प्रयासों से अब स्थानीय स्तर पर पाश्चुरीकृत दूध, पाउडर और कुल्फी जैसे उत्पाद तैयार हो रहे हैं।",
      "507 हेड के पशुपालकों का कहना है कि यदि संगठित दुग्ध संकलन केंद्र बन जाएं, तो ऊँट पालन एक बार फिर मरुस्थल की सबसे मजबूत आजीविका बन सकता है।",
    ],
  },
  {
    id: "art-10",
    slug: "raat-ke-sannate-me-nahari-paani-ki-baari",
    title:
      "रात के सन्नाटे में नहरी पानी की बारी: किसान के धैर्य और हौसले की दास्तान",
    excerpt:
      "कड़ाके की ठंड और अंधेरी रातों में नहरी खाळे पर फावड़ा थामे किसान की पहरेदारी की वास्तविक रिपोर्ट।",
    category_slug: "kisan",
    category_name: "किसान",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://www.shutterstock.com/editorial/image-editorial/MdTeE53aN8jbI02cMzE3NzA=/village-life-daily-farmers-farmer-irrigating-his-440nw-11666024d.jpg",
    featured_image_alt: "रात के समय खेत में पानी लगाता किसान",
    featured_image_caption:
      "नहरी बारी के दौरान रात का सन्नाटा और किसान की मेहनत",
    is_featured: false,
    published_at: "2026-10-11T16:00:00.000Z",
    reading_time_minutes: 3,
    tags: ["नहरी बारी", "किसान", "मेहनत", "सिंचाई", "संघर्ष"],
    body: [
      "नहरी क्षेत्र में पानी की 'बारी' तय समय पर आती है—चाहे वह दोपहर की तपती धूप हो या आधी रात का अंधेरा। 507 हेड के खेतों में रात 2 बजे भी टॉर्च की रोशनी में किसान फावड़े से नाका बदलते दिखाई देते हैं।",
      "एक पल की चूक से पानी पड़ोसी के खेत या निचले गड्ढे में बह सकता है, इसलिए पूरी रात जागकर निगरानी रखनी पड़ती है।",
      "यह संघर्ष केवल फसल पकाने का नहीं, बल्कि परिवार के भरण-पोषण और देश को अन्न देने की उस निस्वार्थ तपस्या का हिस्सा है जो हर किसान रोज़ जीता है।",
    ],
  },
  {
    id: "art-11",
    slug: "purane-kund-aur-tanke-jal-parampara",
    title:
      "पानी की एक-एक बूँद का मान: पुराने कुंडों और टांकों की अनूठी मरुस्थलीय जल परंपरा",
    excerpt:
      "आधुनिक पाइपलाइनों से सदियों पहले थार के लोगों ने छत और आगोर के हर कतरे को सहेजने का जो विज्ञान गढ़ा, वह आज भी प्रेरणा है।",
    category_slug: "wisdom",
    category_name: "बुजुर्गों की सीख",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://media.assettype.com/indiawaterportal-hindi%2Fimport%2F5546%2F11475902195_41bed58549_o.jpg?w=640&auto=format%2Ccompress",
    featured_image_alt: "पारंपरिक राजस्थानी टांका और जल संचयन",
    featured_image_caption: "थार मरुस्थल में वर्षा जल संचयन की पारंपरिक तकनीक",
    is_featured: false,
    published_at: "2026-10-10T11:45:00.000Z",
    reading_time_minutes: 4,
    tags: ["जल संरक्षण", "टांका", "कुंड", "बुजुर्ग", "परंपरा"],
    body: [
      "बुजुर्ग कहते हैं—'घी ढुल्या म्हारो कुछ नी जावे, पाणी ढुल्या म्हारो जीव जावे।' थार में पानी का सम्मान ईश्वर के समान रहा है।",
      "गाँव के हर घर और खेत में पक्के टांके (पारंपरिक जल कुंड) बनाए जाते थे, जिनका आगोर इतना साफ रखा जाता था कि बारिश का पानी सीधे कुंड में छनकर गिरता था। यह पानी 2 साल तक बिना खराब हुए मीठा और शीतल रहता था।",
      "आज जब भूजल स्तर गिर रहा है, 507 हेड के कई किसान अपने खेतों में फार्म पौंड और रेन वाटर हार्वेस्टिंग टांके बनाकर न केवल पीने का पानी सहेज रहे हैं, बल्कि नहरी बंदी के समय फसलों को भी जीवनदान दे रहे हैं।",
    ],
  },
  {
    id: "art-12",
    slug: "matira-kachri-chatni-marusthal-swad",
    title:
      "मतीरे की सब्जी और काचरी की चटनी: गर्मियों में ठंडक और मरुस्थलीय स्वाद",
    excerpt:
      "धोरों में बेल पर पकने वाले मतीरे और जंगली काचरी के औषधीय गुण और पारंपरिक जायके की अनूठी दास्तान।",
    category_slug: "food",
    category_name: "खान-पान",
    author: DEFAULT_AUTHOR,
    featured_image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUZ9sSvY4pB808MuwgpaxZV_4MOkbYGYjlhHJJezbbZI9AMnXsePaH5zIg&s=10",
    featured_image_alt: "ताजी काचरी और देशी राजस्थानी सामग्री",
    featured_image_caption: "प्राकृतिक स्वाद और पोषण से भरपूर मरुस्थलीय उपज",
    is_featured: false,
    published_at: "2026-10-09T13:20:00.000Z",
    reading_time_minutes: 3,
    tags: ["मतीरा", "काचरी", "चटनी", "खान-पान", "स्वाद"],
    body: [
      "थार के रेतीले खेतों में वर्षा ऋतु के बाद मतीरे और काचरी की बेलें स्वतः ही फैल जाती हैं। कच्चे मतीरे की सब्जी और पके मतीरे का मीठा लाल गूदा रेगिस्तान की तपिश में अमृत के समान होता है।",
      "काचरी को सिलबट्टे पर लाल मिर्च, लहसुन और जीरे के साथ पीसकर बनाई गई ताजी चटनी बाजरे की रोटी के साथ खाई जाती है। यह चटनी पाचन क्रिया को दुरुस्त रखती है और लू से बचाती है।",
      "शहरी बाजारों में अब इस देशी उपज की भारी मांग है और यह स्थानीय किसानों के लिए अतिरिक्त आमदनी का साधन बन रही है।",
    ],
  },
];

const CURATED_FEATURED_IMAGES: Record<string, string> = {
  "rathi-gaay-marusthal-ki-kamdhenu":
    "https://img-cdn.krishijagran.com/68043/ty.jpeg",
  "purane-kund-aur-tanke-jal-parampara":
    "https://media.assettype.com/indiawaterportal-hindi%2Fimport%2F5546%2F11475902195_41bed58549_o.jpg?w=640&auto=format%2Ccompress",
  "raat-ke-sannate-me-nahari-paani-ki-baari":
    "https://www.shutterstock.com/editorial/image-editorial/MdTeE53aN8jbI02cMzE3NzA=/village-life-daily-farmers-farmer-irrigating-his-440nw-11666024d.jpg",
  "kinnu-anaar-kheti-bikaner-munafa":
    "https://media.istockphoto.com/id/1050650472/photo/ripe-pomegranate-fruits-on-the-branches-of-trees-in-the-garden-rows-of-pomegranate-trees-with.jpg?s=612x612&w=0&k=20&c=C_GX-u9pCaznrSdl2SGVAtVul8N5kFglGKyRy12ThbM=",
  "kisan-mehanat-anubhav-desh-ki-shaan":
    "https://sc0.blr1.cdn.digitaloceanspaces.com/article/196544-fiimlmpoxr-1702239573.jpg",
  "thar-sanskriti-lokgeet-parampara":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Rajasthan_Folk_Music.jpg/3840px-Rajasthan_Folk_Music.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
  "untni-ka-doodh-marusthal-dairy":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxNh_R6xE4OQOOs7ty00IOmVb0YUMOh_NhST3yLBf-jA&s=10",
  "thar-registan-507-head-itihas":
    "https://images.bhaskarassets.com/web2images/521/2025/08/11/orig_4-1-1-1-1-1-1-1-1-1-1-1_1754872440.jpg",
  "nahari-kshetra-kheti-unnat-tarike":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi5OaYV-_JlxDzp2JKqU7NJ9a4AXX-bggjKNeBXp1ZTg&s=10",
  "bujurgon-ke-tajurbe-aur-paramparik-seekh":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7tsXyf-KOkWlFBzQTjJF-MK7S1p3MclAEMeOpgNJPPb_rMosdeOSRaH4R&s=10",
  "bajra-roti-sangri-marusthal-poshan":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoAhYxoVz_zQeD-Ki_4T6gpbFKYqf4y9P11rJgGY23dB2kVAOvApsnqHwO&s=10",
  "matira-kachri-chatni-marusthal-swad":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUZ9sSvY4pB808MuwgpaxZV_4MOkbYGYjlhHJJezbbZI9AMnXsePaH5zIg&s=10",
};

export async function getAllPublishedArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("published-articles");

  try {
    const supabase = createPublicClient();
    if (!supabase) return INITIAL_ARTICLES;

    const { data: dbArticles } = await supabase
      .from("articles")
      .select(
        "id, slug, title, excerpt, body, body_json, featured_image_url, featured_image_alt, featured_image_caption, featured_image_credit, is_featured, published_at, updated_at, category_id, author_id, categories(id, name, slug)",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (dbArticles && dbArticles.length > 0) {
      const CATEGORY_LOOKUP: Record<string, { slug: string; name: string }> = {
        news: { slug: "news", name: "ताज़ा खबरें और रिपोर्ट" },
        farming: { slug: "farming", name: "खेती-बाड़ी" },
        kheti: { slug: "farming", name: "खेती-बाड़ी" },
        pashupalan: { slug: "pashupalan", name: "पशुपालन" },
        kisan: { slug: "kisan", name: "किसान" },
        wisdom: { slug: "wisdom", name: "बुजुर्गों की सीख" },
        history: { slug: "history", name: "इतिहास और विरासत" },
        heritage: { slug: "heritage", name: "सांस्कृतिक विरासत" },
        food: { slug: "food", name: "खान-पान" },
        shiksha: { slug: "news", name: "ताज़ा खबरें और रिपोर्ट" },
        shikhsa: { slug: "news", name: "ताज़ा खबरें और रिपोर्ट" },
      };

      const mappedDbArticles: Article[] = dbArticles.map((item) => {
        const bodyArray = Array.isArray(item.body)
          ? item.body
          : typeof item.body === "string"
            ? item.body.split("\n\n").filter(Boolean)
            : [];

        const catObj = item.categories as {
          id?: string;
          name?: string;
          slug?: string;
        } | null;
        let matchedSlug = catObj?.slug
          ? CATEGORY_LOOKUP[catObj.slug.toLowerCase()]?.slug || catObj.slug
          : null;
        let matchedName = catObj?.name
          ? CATEGORY_LOOKUP[catObj.slug?.toLowerCase() || ""]?.name ||
            catObj.name
          : null;

        // If category is null in DB, check INITIAL_ARTICLES matching by slug
        if (!matchedSlug) {
          const initMatch = INITIAL_ARTICLES.find(
            (init) => init.slug === item.slug,
          );
          if (initMatch) {
            matchedSlug = initMatch.category_slug;
            matchedName = initMatch.category_name;
          }
        }

        // Smart keyword detection for any unassigned articles
        if (!matchedSlug) {
          const t = (
            item.title +
            " " +
            (item.excerpt || "") +
            " " +
            (item.body || "")
          ).toLowerCase();
          if (
            t.includes("गाय") ||
            t.includes("पशु") ||
            t.includes("ऊँट") ||
            t.includes("डेयरी") ||
            t.includes("दूध")
          ) {
            matchedSlug = "pashupalan";
            matchedName = "पशुपालन";
          } else if (
            t.includes("खेती") ||
            t.includes("फसल") ||
            t.includes("सिंचाई") ||
            t.includes("किन्नू") ||
            t.includes("अनार")
          ) {
            matchedSlug = "farming";
            matchedName = "खेती-बाड़ी";
          } else if (t.includes("किसान") || t.includes("अन्नदाता")) {
            matchedSlug = "kisan";
            matchedName = "किसान";
          } else if (
            t.includes("खान") ||
            t.includes("बाजरा") ||
            t.includes("सांगरी") ||
            t.includes("सोगरा") ||
            t.includes("काचरी") ||
            t.includes("मतीरा")
          ) {
            matchedSlug = "food";
            matchedName = "खान-पान";
          } else if (
            t.includes("बुजुर्ग") ||
            t.includes("सीख") ||
            t.includes("चौपाल")
          ) {
            matchedSlug = "wisdom";
            matchedName = "बुजुर्गों की सीख";
          } else if (
            t.includes("विरासत") ||
            t.includes("लोकगीत") ||
            t.includes("संगीत") ||
            t.includes("संस्कृति") ||
            t.includes("मांड")
          ) {
            matchedSlug = "heritage";
            matchedName = "सांस्कृतिक विरासत";
          } else if (
            t.includes("इतिहास") ||
            t.includes("धरोहर") ||
            t.includes("कुंड") ||
            t.includes("टांके") ||
            t.includes("507 हेड")
          ) {
            matchedSlug = "history";
            matchedName = "इतिहास और विरासत";
          } else {
            matchedSlug = "news";
            matchedName = "ताज़ा खबरें और रिपोर्ट";
          }
        }

        return {
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          excerpt:
            item.excerpt ||
            (bodyArray[0] ? bodyArray[0].slice(0, 150) + "..." : ""),
          body: bodyArray.length ? bodyArray : [item.title],
          rich_body:
            typeof item.body_json === "object" && item.body_json
              ? parseRichText(JSON.stringify(item.body_json))
              : null,
          category_slug: matchedSlug || "news",
          category_name: matchedName || "ताज़ा खबरें",
          author: DEFAULT_AUTHOR,
          featured_image_url:
            CURATED_FEATURED_IMAGES[item.slug] ||
            item.featured_image_url ||
            "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=85",
          featured_image_alt: item.featured_image_alt || item.title,
          featured_image_caption: item.featured_image_caption || undefined,
          featured_image_credit: item.featured_image_credit || undefined,
          is_featured: Boolean(item.is_featured),
          published_at: item.published_at || new Date().toISOString(),
          reading_time_minutes: 4,
          tags: ["507 हेड", matchedName || "समाचार"],
        };
      });

      // Combine with initial articles to ensure all 7 categories are rich
      const dbSlugs = new Set(mappedDbArticles.map((a) => a.slug));
      const cleanDbArticles = mappedDbArticles.filter(
        (a) => a.title !== "testing" && a.title !== "shiksha",
      );
      const combined = [...cleanDbArticles];
      for (const initial of INITIAL_ARTICLES) {
        if (!dbSlugs.has(initial.slug)) {
          combined.push(initial);
        }
      }
      return combined;
    }
  } catch (error) {
    console.error("Error fetching articles from Supabase:", error);
  }

  return INITIAL_ARTICLES;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const all = await getAllPublishedArticles();
  const normalizeSlug = (value: string) => {
    try {
      return decodeURIComponent(value).normalize("NFC").replace(/\/+$/, "");
    } catch {
      return value.normalize("NFC").replace(/\/+$/, "");
    }
  };
  const requestedSlug = normalizeSlug(slug);

  return (
    all.find((article) => normalizeSlug(article.slug) === requestedSlug) ?? null
  );
}

export async function getArticlesByCategory(
  categorySlug: string,
): Promise<Article[]> {
  const all = await getAllPublishedArticles();
  return all.filter((article) => article.category_slug === categorySlug);
}

export async function getFeaturedArticle(): Promise<Article> {
  const all = await getAllPublishedArticles();
  const featured =
    all.find((article) => article.slug === "thar-registan-507-head-itihas") ||
    all.find((article) => article.is_featured) ||
    INITIAL_ARTICLES[0];
  return featured;
}

export async function getRelatedArticles(
  categorySlug: string,
  excludeArticleId: string,
  limit: number = 3,
): Promise<Article[]> {
  const all = await getAllPublishedArticles();
  const related = all.filter(
    (article) =>
      article.category_slug === categorySlug && article.id !== excludeArticleId,
  );

  if (related.length < limit) {
    const others = all.filter(
      (article) =>
        article.id !== excludeArticleId && !related.includes(article),
    );
    return [...related, ...others].slice(0, limit);
  }

  return related.slice(0, limit);
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("authors");

  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data: author } = await supabase
        .from("authors")
        .select("id, slug, name, bio, avatar_url")
        .eq("slug", slug)
        .maybeSingle();

      if (author) {
        return {
          id: author.id,
          slug: author.slug,
          name: author.name,
          bio: author.bio || DEFAULT_AUTHOR.bio,
          avatar_url: author.avatar_url || DEFAULT_AUTHOR.avatar_url,
        };
      }
    }
  } catch (err) {
    console.error("Error fetching author:", err);
  }

  if (
    slug === DEFAULT_AUTHOR.slug ||
    slug === "507-head-team" ||
    slug === "507-head-desk"
  ) {
    return DEFAULT_AUTHOR;
  }

  return DEFAULT_AUTHOR;
}

export async function getArticlesByAuthor(
  authorSlug: string,
): Promise<Article[]> {
  const all = await getAllPublishedArticles();
  return all.filter(
    (article) =>
      article.author.slug === authorSlug ||
      (authorSlug.includes("507-head") &&
        article.author.slug.includes("507-head")),
  );
}
