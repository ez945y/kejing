--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Homebrew)
-- Dumped by pg_dump version 16.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: labelenum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.labelenum AS ENUM (
    'BUSINESS',
    'HOUSE'
);


ALTER TYPE public.labelenum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: albums; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.albums (
    id integer NOT NULL,
    album_name character varying(100) NOT NULL,
    label public.labelenum NOT NULL,
    description text,
    cover_image character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.albums OWNER TO postgres;

--
-- Name: albums_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.albums_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.albums_id_seq OWNER TO postgres;

--
-- Name: albums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.albums_id_seq OWNED BY public.albums.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(100) NOT NULL,
    message text NOT NULL,
    is_read integer,
    created_at timestamp without time zone
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id integer NOT NULL,
    image_name character varying(255) NOT NULL,
    object_name character varying(255) NOT NULL,
    description text,
    album_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.images OWNER TO postgres;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.images_id_seq OWNER TO postgres;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    icon character varying(50),
    "order" integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: albums id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums ALTER COLUMN id SET DEFAULT nextval('public.albums_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Data for Name: albums; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.albums (id, album_name, label, description, cover_image, created_at, updated_at) FROM stdin;
4	test1	BUSINESS	test1	5	2025-04-16 14:08:36.745156	2025-04-16 15:15:44.60944
2	test2	HOUSE	test2	6	2025-04-16 13:18:32.778943	2025-04-16 15:22:43.769762
6	test3	HOUSE		7	2025-04-16 19:07:51.293513	2025-04-16 19:08:02.432849
7	test4	BUSINESS		8	2025-04-16 19:08:14.278957	2025-04-16 19:08:28.481751
8	test5	HOUSE		9	2025-04-16 19:08:37.236091	2025-04-16 19:09:02.299416
9	test6	BUSINESS		10	2025-04-16 19:09:28.322687	2025-04-16 19:09:38.597557
11	test8	BUSINESS		11	2025-04-16 19:11:09.525622	2025-04-16 19:11:15.750338
10	test7	HOUSE		12	2025-04-16 19:10:58.72409	2025-04-16 19:17:08.30255
12	test9	HOUSE		13	2025-04-16 19:17:31.593781	2025-04-16 19:18:16.711222
13	test10	BUSINESS		14	2025-04-16 19:18:25.851963	2025-04-16 19:18:43.615186
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, name, phone, email, message, is_read, created_at) FROM stdin;
1	测试用户	123456789	test@example.com	这是一条测试消息	0	2025-04-16 15:06:52.349579
2	ddd	ddd	dd@ddd	ddd	0	2025-04-16 15:07:10.172782
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id, image_name, object_name, description, album_id, created_at, updated_at) FROM stdin;
1	original.jpg	uploads/2/20250416131842.jpg	\N	2	2025-04-16 13:18:42.72161	2025-04-16 13:18:42.72161
2	original.jpg	uploads/4/20250416140844.jpg	\N	4	2025-04-16 14:08:44.166804	2025-04-16 14:08:44.166804
5	2.jpg	uploads/4/20250416151543.jpg	\N	4	2025-04-16 15:15:43.594831	2025-04-16 15:15:43.594831
6	1.jpg	uploads/2/20250416151553.jpg	\N	2	2025-04-16 15:15:53.307232	2025-04-16 15:15:53.307232
7	monky.png	uploads/6/20250416190758.png	\N	6	2025-04-16 19:07:58.759859	2025-04-16 19:07:58.759859
8	go-back-arrow.png	uploads/7/20250416190826.png	\N	7	2025-04-16 19:08:26.46441	2025-04-16 19:08:26.46441
9	power.png	uploads/8/20250416190900.png	\N	8	2025-04-16 19:09:00.196807	2025-04-16 19:09:00.196807
10	x_button.png	uploads/9/20250416190934.png	\N	9	2025-04-16 19:09:34.933025	2025-04-16 19:09:34.933025
11	capacity.png	uploads/11/20250416191113.png	\N	11	2025-04-16 19:11:13.216738	2025-04-16 19:11:13.216738
12	20150911_1.jpg	uploads/10/20250416191705.jpg	\N	10	2025-04-16 19:17:05.227209	2025-04-16 19:17:05.227209
13	folder.png	uploads/12/20250416191802.png	\N	12	2025-04-16 19:18:02.154355	2025-04-16 19:18:02.154355
14	red.png	uploads/13/20250416191838.png	\N	13	2025-04-16 19:18:38.89843	2025-04-16 19:18:38.89843
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name, description, icon, "order", created_at, updated_at) FROM stdin;
1	專業設計	客製化空間規劃，根據您的需求打造理想家居。	lightbulb	1	2025-04-16 14:12:45.883571	2025-04-16 14:44:25.771819
2	精緻施工	高品質裝修工程，自有施工團隊確保工程品質。	home	2	2025-04-16 14:12:45.883571	2025-04-16 14:44:29.831353
3	全屋翻新	舊屋改造煥然一新，讓陳舊空間重獲新生。	refresh-cw	3	2025-04-16 14:12:45.883571	2025-04-16 14:44:33.331916
4	智能家居	現代化智慧空間，提升居住體驗與便利性。	smartphone	4	2025-04-16 14:12:45.883571	2025-04-16 19:22:52.221235
\.


--
-- Name: albums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.albums_id_seq', 13, true);


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 2, true);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.images_id_seq', 14, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 1, true);


--
-- Name: albums albums_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: ix_albums_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_albums_id ON public.albums USING btree (id);


--
-- Name: ix_contacts_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_contacts_id ON public.contacts USING btree (id);


--
-- Name: ix_images_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_images_id ON public.images USING btree (id);


--
-- Name: ix_services_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_services_id ON public.services USING btree (id);


--
-- Name: images images_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id);


--
-- PostgreSQL database dump complete
--

