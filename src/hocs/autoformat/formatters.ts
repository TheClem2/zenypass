/**
 * @license
 * Copyright 2018 Stephane M. Catala
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * Limitations under the License.
 */
//
import { propCursor, into } from 'basic-cursors'
import compose from 'basic-compose'
import { Either, right, left } from 'utils'

export { Either, right }

export type Formatter<V> = (value: V) => Either<V, FormatError<V>>

export interface FormatError<V> {
  value: V
  error: Error
}

const IS_ACCEPTABLE_URL = // 1 = protocol, 2 = auth, 3 = domain, 4 = port, 5 = path
  /^(?:\w+?:\/\/)?(?:[^@/?]+@)?(?:(?:[^.:/?]+\.)+?[^.:/?]{2,})(?::\d{2,5})?(?:[/?].*)?$/
const HAS_PROTOCOL = /^\w+:\/\//

function formatUrl(value: string): Either<string,FormatError<string>> {
  return IS_ACCEPTABLE_URL.test(value)
    ? right(HAS_PROTOCOL.test(value) ? value : `https://${value}`)
    : left({ value, error: new Error('Invalid URL') })
}

const IS_ACCEPTABLE_EMAIL = /^[^@]+@[^@]+$/

function formatEmail(value: string): Either<string,FormatError<string>> {
  return IS_ACCEPTABLE_EMAIL.test(value)
    ? right(value)
    : left({ value, error: new Error('Invalid Email') })
}

const CSV_SEPARATOR = /[\s,]+/
function formatCsv(value: string): Either<string[],FormatError<string>> {
  return right(value.split(CSV_SEPARATOR).filter(Boolean))
}

export default {
  url: formatUrl,
  email: formatEmail,
  csv: formatCsv
}
