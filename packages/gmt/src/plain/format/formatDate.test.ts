import { Temporal, Intl as TIntl } from "@js-temporal/polyfill";
import { expectedForEnv, MustTestLocales } from "../../test";
import { mockTemporalPlainDateFromThrow } from "../../test/mocks";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  // en-US
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"Saturday, February 3, 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"February 3, 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"Feb 3, 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"2/3/24"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"February 3, 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"Feb 3, 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"02/03/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"2/3/2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"2/3/24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"02/03/24"}
  `(
    "formats valid date $value for en-US with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.enUS, options)).toEqual(
        expected,
      );
    },
  );
  // en-GB
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"Saturday, 3 February 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 February 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3 Feb 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 February 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3 Feb 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"03/02/24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03/02/24"}
  `(
    "formats valid date $value for en-GB with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.enGB, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.enGB, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );
  // de-DE
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"Samstag, 3. Februar 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3. Februar 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"03.02.24"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3. Februar 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3. Feb. 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"3.2.2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"3.2.24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03.02.24"}
  `(
    "formats valid date $value for de-DE with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.deDE, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.deDE, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // fr-FR
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"samedi 3 février 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 février 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3 févr. 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 février 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3 févr. 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"03/02/24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03/02/24"}
  `(
    "formats valid date $value for fr-FR with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.frFR, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.frFR, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // es-ES
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"sábado, 3 de febrero de 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 de febrero de 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3 feb 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"3/2/24"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 de febrero de 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3 feb 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"3/2/2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"3/2/24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03/02/24"}
  `(
    "formats valid date $value for es-ES with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.esES, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.esES, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // it-IT
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"sabato 3 febbraio 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 febbraio 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3 feb 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"03/02/24"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 febbraio 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3 feb 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"03/02/24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03/02/24"}
  `(
    "formats valid date $value for it-IT with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.itIT, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.itIT, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // pt-PT
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"sábado, 3 de fevereiro de 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 de fevereiro de 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"03/02/24"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 de fevereiro de 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3/02/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"03/02/2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"03/02/24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03/02/24"}
  `(
    "formats valid date $value for pt-PT with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.ptPT, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.ptPT, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // sv-SE
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"lördag 3 februari 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 februari 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3 feb. 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"2024-02-03"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 februari 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3 feb. 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"2024-02-03"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"2024-02-03"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"24-02-03"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"24-02-03"}
  `(
    "formats valid date $value for sv-SE with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.svSE, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.svSE, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // is-IS
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"laugardagur, 3. febrúar 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3. febrúar 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3. feb. 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"3.2.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3. febrúar 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3. feb. 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"3.2.2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"3.2.24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03.02.24"}
  `(
    "formats valid date $value for is-IS with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.isIS, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.isIS, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // zh-CN
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"2024年2月3日星期六"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"2024年2月3日"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"2024年2月3日"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"2024/02/03"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"24/2/3"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"24/02/03"}
  `(
    "formats valid date $value for zh-CN with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.zhCN, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.zhCN, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // zh-TW
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"2024年2月3日 星期六"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"2024年2月3日"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"2024年2月3日"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"2024/02/03"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"24/2/3"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"24/02/03"}
  `(
    "formats valid date $value for zh-TW with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.zhTW, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.zhTW, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // ja-JP
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"2024年2月3日土曜日"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"2024年2月3日"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"2024/02/03"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"2024/02/03"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"2024/02/03"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"2024/2/3"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"24/2/3"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"24/02/03"}
  `(
    "formats valid date $value for ja-JP with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.jaJP, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.jaJP, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // ko-KR
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"2024년 2월 3일 토요일"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"2024년 2월 3일"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"2024. 2. 3."}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"24. 2. 3."}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"2024년 2월 3일"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"2024년 2월 3일"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"2024. 02. 03."}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"2024. 2. 3."}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"24. 2. 3."}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"24. 02. 03."}
  `(
    "formats valid date $value for ko-KR with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.koKR, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.koKR, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // ar-SA
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"السبت، ٣ فبراير ٢٠٢٤"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"٣ فبراير ٢٠٢٤"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"٠٣/٠٢/٢٠٢٤"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"٣/٢/٢٠٢٤"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"٣ فبراير ٢٠٢٤"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"٣ فبراير ٢٠٢٤"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"٠٣/٠٢/٢٠٢٤"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"٣/٢/٢٠٢٤"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"٣/٢/٢٤"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"٠٣/٠٢/٢٤"}
  `(
    "formats valid date $value for ar-SA with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.arSA, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.arSA, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // he-IL
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"יום שבת, 3 בפברואר 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 בפברואר 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3 בפבר׳ 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"3.2.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 בפברואר 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3 בפבר׳ 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"3.2.2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"3.2.24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03.02.24"}
  `(
    "formats valid date $value for he-IL with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.heIL, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.heIL, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // ru-RU
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"суббота, 3 февраля 2024 г."}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 февраля 2024 г."}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3 февр. 2024 г."}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 февраля 2024 г."}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3 февр. 2024 г."}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"03.02.24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03.02.24"}
  `(
    "formats valid date $value for ru-RU with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.ruRU, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.ruRU, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  // tr-TR
  it.each`
    value           | options                                                  | expected
    ${"2024-02-03"} | ${{ dateStyle: "full" }}                                 | ${"3 Şubat 2024 Cumartesi"}
    ${"2024-02-03"} | ${{ dateStyle: "long" }}                                 | ${"3 Şubat 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "medium" }}                               | ${"3 Şub 2024"}
    ${"2024-02-03"} | ${{ dateStyle: "short" }}                                | ${"3.02.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "long", day: "numeric" }}    | ${"3 Şubat 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "short", day: "numeric" }}   | ${"3 Şub 2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }} | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ year: "numeric", month: "numeric", day: "numeric" }} | ${"03.02.2024"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "numeric", day: "numeric" }} | ${"03.02.24"}
    ${"2024-02-03"} | ${{ year: "2-digit", month: "2-digit", day: "2-digit" }} | ${"03.02.24"}
  `(
    "formats valid date $value for tr-TR with options $options to $expected",
    ({ value, options, expected }) => {
      expect(formatDate(value, MustTestLocales.trTR, options)).toEqual(
        expectedForEnv(expected, () =>
          new TIntl.DateTimeFormat(MustTestLocales.trTR, options).format(
            Temporal.PlainDate.from(value),
          ),
        ),
      );
    },
  );

  it.each`
    invalidValue
    ${"not-a-date"}
    ${"2024-02-30"}
    ${"2024-02-29T12:00:00"}
    ${""}
    ${null}
    ${undefined}
    ${true}
  `(
    "returns an empty string for invalid date $invalidValue",
    ({ invalidValue }) => {
      expect(formatDate(invalidValue as never)).toBe("");
    },
  );

  it("returns empty string on failure", () => {
    mockTemporalPlainDateFromThrow();
    const result = formatDate("2024-02-29");
    expect(result).toBe("");
  });
});
